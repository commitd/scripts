import { logger, newCommand } from "../utils"

export const exampleCommand = newCommand(
  "example",
  "An hello world example you can use to test the system."
).action(async (options) => {
  logger.info("Hello from NodeJS and Typescript")
  if (options["dry-run"]) {
    logger.info("DRY-RUN: In dry run mode")
  }
})
