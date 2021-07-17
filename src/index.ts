import { pythonCommand } from "./py-command"
import { shellCommand } from "./shell-command"
import { launch } from "./utils"

launch("index", "Committed Scripts", shellCommand, pythonCommand)
