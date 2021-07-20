import { Command, program } from "bandersnatch"
import { homedir } from "os"
import { join } from "path"
import { argv } from "process"
import { exampleCommand } from "./example-command"
import { pythonCommand, runPython } from "./py-command"
import { runShell, shellCommand } from "./shell-command"
import { sonarCommand } from "./sonar-command"
import { logger } from "./utils"

async function launch(
  name: string,
  description: string,
  ...commands: Command[]
): Promise<unknown> {
  const p = program({
    description,
    version: true,
    historyFile: join(homedir(), `.commitd_script_${name}_history`),
    help: true,
    prompt: `@commitd/scripts ${name} > `,
  }).default(
    new Command("hello").action(() =>
      logger.info("Welcome from Committed Scripts, use `help` to get started")
    )
  )

  for (const c of commands) {
    p.add(c)
  }

  // Bandersnatch enforces strict mode, (don't let us have options it doesn't know about).
  // Therefore it's not possible to pass options to Python / Bash scripts
  // as they aren't part of the known options here.
  // So we basically skip bandersnatch in these two command special cases
  // Note that repl still requires quoting, etc

  if (argv.length >= 3) {
    const command = argv[2]
    if (command === "python" || command === "py") {
      return runPython({
        script: argv[3],
        "script-arguments": argv.slice(4),
        "dry-run": argv.includes("--dry-run"),
      })
    } else if (command === "shell" || command === "sh") {
      return runShell({
        script: argv[3],
        "script-arguments": argv.slice(4),
        "dry-run": argv.includes("--dry-run"),
      })
    }
  }

  return p.runOrRepl()
}

launch(
  "index",
  "Committed Scripts",
  shellCommand,
  pythonCommand,
  sonarCommand,
  exampleCommand
)
  .then(() => {
    logger.debug("Done.")
  })
  .catch((err) => {
    logger.error("An error occurred")
    logger.error(err)
    process.exit(1)
  })
