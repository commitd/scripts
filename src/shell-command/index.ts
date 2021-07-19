import { exec, findFileInPackage, logger, newCommand } from "../utils"
import { SHELL_DIR } from "../utils/constants"

export const shellCommand = newCommand(
  "shell",
  "Run a command @commitd/scripts in a shell. This assumes you have the bash shell."
)
  .argument("script", {
    description:
      "The script name (name of the directory within the root of the repo)",
  })
  .argument("script-arguments", {
    description: "The arguments for the script",
    variadic: true,
  })
  .action(async (options) => {
    logger.debug(options)

    const scriptExecutable = findFileInPackage(
      SHELL_DIR,
      options.script,
      `${options.script}.sh`
    )

    if (!scriptExecutable) {
      logger.error("Script %s does not exist", options.script)
      return 1
    }

    logger.info(
      "Running shell: `%s %s`",
      options.script,
      options["script-arguments"].join(" ")
    )
    logger.debug("Command run from %s", scriptExecutable)
    if (options["dry-run"]) {
      logger.info("DRY-RUN: Not running shell command")
    } else {
      const r = await exec("bash", [
        scriptExecutable,
        ...options["script-arguments"],
      ])
      logger.info("Shell completed with exit code %d", r.exitCode)
    }
  })
