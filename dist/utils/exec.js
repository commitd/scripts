"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.DEFAULT_EXEC_OPTIONS = void 0;
const execa_1 = __importDefault(require("execa"));
exports.DEFAULT_EXEC_OPTIONS = {
    env: {},
    timeout: 0,
    pipe: true,
};
async function exec(command, args = [], options = exports.DEFAULT_EXEC_OPTIONS) {
    const execaOptions = {
        cleanup: true,
        extendEnv: true,
        env: options.env || exports.DEFAULT_EXEC_OPTIONS.env,
        timeout: options.timeout || exports.DEFAULT_EXEC_OPTIONS.timeout,
        // We want to get the exit code, not a JS error thrown
        reject: false,
    };
    const e = execa_1.default(command, args, execaOptions);
    if (options.pipe) {
        if (e.stdout) {
            e.stdout.pipe(process.stdout);
        }
        if (e.stderr) {
            e.stderr.pipe(process.stderr);
        }
        if (e.stdin) {
            process.stdin.pipe(e.stdin);
        }
    }
    const r = await e;
    if (options.pipe) {
        if (e.stdin) {
            process.stdin.unpipe(e.stdin);
        }
    }
    return {
        exitCode: r.exitCode,
        stdio: r.stdout ?? "",
        stderr: r.stderr ?? "",
    };
}
exports.exec = exec;
