"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFileInPackage = void 0;
const logger_1 = require("./logger");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const packageJsonDir = path_1.default.resolve(__dirname, "../..");
function findFileInPackage(...paths) {
    const scriptsBaseDir = packageJsonDir || process.env.INIT_CWD || process.cwd();
    const file = path_1.default.join(...[scriptsBaseDir, ...paths]);
    if (!fs_1.default.existsSync(file)) {
        logger_1.logger.error("File does not exist in package: %s in %s", path_1.default.join(...paths), scriptsBaseDir);
        return undefined;
    }
    return path_1.default.resolve(file);
}
exports.findFileInPackage = findFileInPackage;
