"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sonarCommand = void 0;
const utils_1 = require("../utils");
const sonarqube_scanner_1 = __importDefault(require("sonarqube-scanner"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.sonarCommand = utils_1.newCommand("sonar", "Run a Sonar analysis and uploads to the Sonarcloud server. This can be used from with GitHub or command line, but when using command line options need to be supplied which are derived automatically from the GitHub Action Environment/Secrets.")
    .argument("package-json", {
    description: "The package.json of the project (or root of the workspace)",
    type: "string",
    default: "./package.json",
})
    .option("sonar-url", {
    description: "Sonar Server to connect to",
    type: "string",
    default: "https://sonarcloud.io",
})
    .option("sonar-token", {
    description: "Sonar Token to use to authenticate to the API",
    type: "string",
})
    .option("project-key", {
    description: "Sonar Project key (which can be seen in the UI). If not, supplied derived from the project name or from the GitHub Repo",
    type: "string",
})
    .option("organisation", {
    description: "Sonar organisation",
    default: "committed",
    type: "string",
})
    .option("exclude-coverage", {
    description: "Exclude glob paths from coverage (e.g **/SwaggerApi.ts)",
    default: "",
    type: "array",
})
    .action(async (options) => {
    const sonarToken = options["sonar-token"] ?? process.env.SONAR_TOKEN;
    const packageJson = openPackageJson(options["package-json"]);
    // If we are running in GitHub CI we can complete the information
    let projectKey = "";
    if (options["project-key"]) {
        projectKey = options["project-key"];
    }
    else if (process.env.GITHUB_REPOSITORY) {
        projectKey = process.env.GITHUB_REPOSITORY.replace("/", "_");
        utils_1.logger.debug(`Derived project key ${projectKey} from repository name`);
    }
    else {
        // Guess the name of the registry (and hence the sonar key)
        projectKey = `commitd_${packageJson.name}`;
    }
    let githubToken = undefined;
    if (process.env.GITHUB_TOKEN) {
        githubToken = process.env.GITHUB_TOKEN;
    }
    let githubPullRequest = undefined;
    if (process.env.GITHUB_PR) {
        githubPullRequest = process.env.GITHUB_PR;
    }
    const rootDir = path_1.default.dirname(path_1.default.resolve(options["package-json"]));
    const packageJsonDirs = await findWorkspacePackageDirs(rootDir);
    const sourceDirs = findSourceDir(packageJsonDirs);
    const allTestExecutions = getTestExecutions(packageJsonDirs);
    utils_1.logger.info(rootDir);
    utils_1.logger.info(packageJsonDirs);
    utils_1.logger.info(sourceDirs);
    utils_1.logger.info(allTestExecutions);
    const parameters = {
        serverUrl: options["sonar-url"],
        token: sonarToken,
        options: {
            // Connecting to Sonarcloud
            "sonar.projectKey": projectKey,
            "sonar.organization": options.organisation,
            // GitHub stuff
            "sonar.github.oauth": githubToken,
            "sonar.github.pullRequest": githubPullRequest,
            "sonar.projectName": packageJson.name,
            "sonar.projectDescription": packageJson.description || "",
            "sonar.sourceEncoding": "UTF-8",
            "sonar.javascript.lcov.reportPaths": "coverage/lcov.info",
            "sonar.python.coverage.reportPaths": "**/coverage.xml",
            "sonar.testExecutionReportPaths": allTestExecutions.join(","),
            "sonar.sources": sourceDirs.join(","),
            "sonar.tests": sourceDirs.join(","),
            "sonar.test.inclusions": [
                "**/*.spec.ts",
                "**/*.spec.tsx",
                "**/*.test.ts",
                "**/*.test.tsx",
                "**/*.spec.js",
                "**/*.spec.jsx",
                "**/*.test.js",
                "**/*.test.jsx",
            ].join(","),
            "sonar.coverage.exclusions": [
                "**/*.test.js",
                "**/*.spec.js",
                "**/*.test.tsx",
                "**/*.spec.tsx",
                "**/*.test.ts",
                "**/*.spec.ts",
                "**/*.mock.ts",
                "**/*.stories.tsx",
                "scripts/**/*.*",
                "**/generators/plopfile.js",
                "**/mockServiceWorker.js",
                "**/src/setupTests.tsx",
                "**/tests/*.*",
                "**/e2e/**/*.ts",
                "**/*.mjs",
                ...options["exclude-coverage"],
            ].join(","),
        },
    };
    utils_1.logger.info(parameters);
    if (options["dry-run"]) {
        utils_1.logger.info("DRY-RUN: Not running sonarqube scanner");
    }
    else {
        sonarqube_scanner_1.default(parameters, () => process.exit());
    }
});
function openPackageJson(file) {
    const f = fs_1.default.readFileSync(file);
    return JSON.parse(f.toString());
}
async function findWorkspacePackageDirs(rootDir) {
    // As Sonar does not support wildcards in certain files we calculate the answer for it.
    if (fs_1.default.existsSync(path_1.default.join(rootDir, "yarn.lock"))) {
        // If Yarn
        const r = await utils_1.exec("yarn", ["workspaces", "--json", "info"], {
            pipe: false,
        });
        if (r.exitCode === 0) {
            const output = r.stdio;
            const raw = JSON.parse(JSON.parse(output).data);
            return Object.values(raw).map((p) => p.location);
        }
    }
    else {
        // npm
        const r = await utils_1.exec("npm", ["exec", "-ws", "-c", "echo $PWD"], {
            pipe: false,
        });
        if (r.exitCode === 0) {
            const output = r.stdio;
            return output.split("\n").map((f) => path_1.default.relative(rootDir, f));
        }
    }
    // Assume this is not a workspace project, and that we are in the module that counts
    // "" = relative(rootDir, rootDir)
    return [""];
}
// Final all sources
function findSourceDir(packageJsonDirs) {
    return (packageJsonDirs
        // TODO src is a convention... perhaps we need something smarter here (read tsconfig, look for py files, etc))
        .map((p) => path_1.default.join(p, "src"))
        .filter((f) => fs_1.default.existsSync(f)));
}
function getTestExecutions(packageJsonDirs) {
    // Get the location of every test-executions.xml
    const allTestExecutions = packageJsonDirs
        .map((p) => path_1.default.join(p, "coverage/test-executions.xml"))
        .filter((f) => fs_1.default.existsSync(f));
    // Sonar seems to need paths relative to the route
    // The test-execution are set up to be full path, so we remove the cwd
    // TODO: relative to the cwd() or relative to the root of project?
    const cwd = process.cwd() + "/";
    const pattern = new RegExp(cwd, "g");
    for (const f of allTestExecutions) {
        const input = fs_1.default.readFileSync(f, "utf8");
        const replaced = input.replace(pattern, "");
        fs_1.default.writeFileSync(f, replaced, "utf8");
    }
    return allTestExecutions;
}
