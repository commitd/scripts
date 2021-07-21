"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newCommand = void 0;
const bandersnatch_1 = require("bandersnatch");
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
