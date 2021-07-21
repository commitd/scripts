"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bandersnatch_1 = require("bandersnatch");
const os_1 = require("os");
const path_1 = require("path");
const process_1 = require("process");
const example_command_1 = require("./example-command");
const py_command_1 = require("./py-command");
const shell_command_1 = require("./shell-command");
const sonar_command_1 = require("./sonar-command");
const utils_1 = require("./utils");
async function launch(name, description, ...commands) {
    const p = bandersnatch_1.program({
        description,
        version: true,
        historyFile: path_1.join(os_1.homedir(), `.commitd_script_${name}_history`),
        help: true,
        prompt: `@commitd/scripts ${name} > `,
    }).default(new bandersnatch_1.Command("hello").action(() => utils_1.logger.info("Welcome from Committed Scripts, use `help` to get started")));
    for (const c of commands) {
        p.add(c);
    }
    // Bandersnatch enforces strict mode, (don't let us have options it doesn't know about).
    // Therefore it's not possible to pass options to Python / Bash scripts
    // as they aren't part of the known options here.
    // So we basically skip bandersnatch in these two command special cases
    // Note that repl still requires quoting, etc
    if (process_1.argv.length >= 3) {
        const command = process_1.argv[2];
        if (command === "python" || command === "py") {
            return py_command_1.runPython({
                script: process_1.argv[3],
                "script-arguments": process_1.argv.slice(4),
                "dry-run": process_1.argv.includes("--dry-run"),
            });
        }
        else if (command === "shell" || command === "sh") {
            return shell_command_1.runShell({
                script: process_1.argv[3],
                "script-arguments": process_1.argv.slice(4),
                "dry-run": process_1.argv.includes("--dry-run"),
            });
        }
    }
    return p.runOrRepl();
}
launch("index", "Committed Scripts", shell_command_1.shellCommand, py_command_1.pythonCommand, sonar_command_1.sonarCommand, example_command_1.exampleCommand)
    .then(() => {
    utils_1.logger.debug("Done.");
})
    .catch((err) => {
    utils_1.logger.error("An error occurred");
    utils_1.logger.error(err);
    process.exit(1);
});
