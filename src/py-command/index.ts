import { PYTHON_DIR } from "../utils/constants"
import { exec, findFileInPackage, logger, newCommand } from "../utils"

export const pythonCommand = newCommand(
  "python",
  "Run a Python script from the @commitd/scripts repository. This assumes you have the python and pip3 installed."
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
      PYTHON_DIR,
      options.script,
      `${options.script}.py`
    )

    if (!scriptExecutable) {
      logger.error("Script %s does not exist", options.script)
      return 1
    }

    const pipRequirements = findFileInPackage(
      PYTHON_DIR,
      options.script,
      `requirements.txt`
    )

    if (pipRequirements) {
      if (!options["dry-run"]) {
        logger.info("DRY-RUN: Found pip requirements, but not installing")
      } else {
        const pip = await exec("pip3", [
          "-r",
          pipRequirements,
          // Try to work without interaction
          "--exists-action",
          "ignore",
        ])
        if (pip.exitCode !== 0) {
          logger.warn("pip returns non-zero exist code %d", pip.exitCode)
        }
      }
    }

    logger.info(
      "Running python: `%s %s`",
      options.script,
      options["script-arguments"].join(" ")
    )
    logger.debug("Command run from %s", scriptExecutable)
    if (options["dry-run"]) {
      logger.info("DRY-RUN: Not running python")
    } else {
      const r = await exec("python3", [
        scriptExecutable,
        ...options["script-arguments"],
      ])
      logger.info("Python completed with exit code %d", r.exitCode)
    }
  })
