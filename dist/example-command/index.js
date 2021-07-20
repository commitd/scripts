"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleCommand = void 0;
const utils_1 = require("../utils");
exports.exampleCommand = utils_1.newCommand("example", "An hello world example you can use to test the system.").action(async (options) => {
    utils_1.logger.info("Hello from NodeJS and Typescript");
    if (options["dry-run"]) {
        utils_1.logger.info("DRY-RUN: In dry run mode");
    }
});
