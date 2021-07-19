"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const py_command_1 = require("./py-command")
const shell_command_1 = require("./shell-command")
const utils_1 = require("./utils")
utils_1.launch(
  "index",
  "Committed Scripts",
  shell_command_1.shellCommand,
  py_command_1.pythonCommand
)
