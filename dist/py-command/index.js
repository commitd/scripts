"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPython = exports.pythonCommand = void 0;
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils");
exports.pythonCommand = utils_1.newCommand("python", "Run a Python script from the @commitd/scripts repository. This assumes you have the python and pip3 installed.")
    .argument("script", {
    description: "The script name (name of the directory within the root of the repo)",
})
    .argument("script-arguments", {
    description: "The arguments for the script",
    variadic: true,
})
    .action(async (options) => {
    return runPython(options);
});
async function runPython(options) {
    utils_1.logger.debug(options);
    const scriptExecutable = utils_1.findFileInPackage(constants_1.PYTHON_DIR, options.script, `${options.script}.py`);
    if (!scriptExecutable) {
        utils_1.logger.error("Script %s does not exist", options.script);
        return 1;
    }
    const pipRequirements = utils_1.findFileInPackage(constants_1.PYTHON_DIR, options.script, `requirements.txt`);
    if (pipRequirements) {
        if (options["dry-run"]) {
            utils_1.logger.info("DRY-RUN: Found pip requirements, but not installing");
        }
        else {
            const pip = await utils_1.exec("pip3", [
                "install",
                "-r",
                pipRequirements,
                // Try to work without interaction
                "--exists-action",
                // ignore
                "i",
            ]);
            if (pip.exitCode !== 0) {
                utils_1.logger.warn("pip returns non-zero exist code %d", pip.exitCode);
            }
        }
    }
    utils_1.logger.info("Running python: `%s %s`", options.script, options["script-arguments"].join(" "));
    utils_1.logger.debug("Command run from %s", scriptExecutable);
    if (options["dry-run"]) {
        utils_1.logger.info("DRY-RUN: Not running python");
        return 0;
    }
    else {
        const r = await utils_1.exec("python3", [
            scriptExecutable,
            ...options["script-arguments"],
        ]);
        utils_1.logger.info("Python completed with exit code %d", r.exitCode);
        return r.exitCode;
    }
}
exports.runPython = runPython;
