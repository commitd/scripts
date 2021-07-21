"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runShell = exports.shellCommand = void 0;
const utils_1 = require("../utils");
const constants_1 = require("../utils/constants");
exports.shellCommand = utils_1.newCommand("shell", "Run a command @commitd/scripts in a shell. This assumes you have the bash shell.")
    .argument("script", {
    description: "The script name (name of the directory within the root of the repo)",
})
    .argument("script-arguments", {
    description: "The arguments for the script",
    variadic: true,
})
    .action(async (options) => {
    return runShell(options);
});
async function runShell(options) {
    utils_1.logger.debug(options);
    const scriptExecutable = utils_1.findFileInPackage(constants_1.SHELL_DIR, options.script, `${options.script}.sh`);
    if (!scriptExecutable) {
        utils_1.logger.error("Script %s does not exist", options.script);
        return 1;
    }
    utils_1.logger.info("Running shell: `%s %s`", options.script, options["script-arguments"].join(" "));
    utils_1.logger.debug("Command run from %s", scriptExecutable);
    if (options["dry-run"]) {
        utils_1.logger.info("DRY-RUN: Not running shell command");
        return 0;
    }
    else {
        const r = await utils_1.exec("bash", [
            scriptExecutable,
            ...options["script-arguments"],
        ]);
        utils_1.logger.info("Shell completed with exit code %d", r.exitCode);
        return r.exitCode;
    }
}
exports.runShell = runShell;
