import { pythonCommand } from "./py-command"
import { shellCommand } from "./shell-command"
import { sonarCommand } from "./sonar-command"
import { launch } from "./utils"

launch("index", "Committed Scripts", shellCommand, pythonCommand, sonarCommand)
