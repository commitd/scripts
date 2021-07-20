"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launch = exports.newCommand = void 0;
const bandersnatch_1 = require("bandersnatch");
const logger_1 = require("./logger");
const path_1 = require("path");
const os_1 = require("os");
/**
 * Creates a new command with standard options
 *
 * @param name command name
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function newCommand(name, description) {
    return bandersnatch_1.command(name).description(description).option("dry-run", {
        description: "Dry run mode - log but do not ac",
        type: "boolean",
        default: false,
    });
}
exports.newCommand = newCommand;
function launch(name, description, ...commands) {
    const p = bandersnatch_1.program({
        description,
        version: true,
        historyFile: path_1.join(os_1.homedir(), `.commitd_script_${name}_history`),
        help: true,
        prompt: `@commitd/scripts ${name} > `,
    }).default(new bandersnatch_1.Command("hello").action(() => logger_1.logger.info("Welcome from Committed Scripts, use `help` to get started")));
    for (const c of commands) {
        p.add(c);
    }
    p.runOrRepl()
        .then(() => {
        logger_1.logger.debug("Done.");
    })
        .catch((err) => {
        logger_1.logger.error("An error occurred");
        logger_1.logger.error(err);
        process.exit(1);
    });
}
exports.launch = launch;
