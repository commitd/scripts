import { command, Command, program } from "bandersnatch"
import { logger } from "./logger"
import { join } from "path"
import { homedir } from "os"

/**
 * Creates a new command with standard options
 *
 * @param name command name
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function newCommand(name: string, description: string) {
  return command(name).description(description).option("dry-run", {
    description: "Dry run mode - log but do not ac",
    type: "boolean",
    default: false,
  })
}

export function launch(
  name: string,
  description: string,
  ...commands: Command[]
): void {
  const p = program({
    description,
    version: true,
    historyFile: join(homedir(), `.commitd_script_${name}_history`),
    help: true,
    prompt: `@commitd/scripts ${name} > `,
  })

  for (const c of commands) {
    p.add(c)
  }

  p.runOrRepl()
    .then(() => {
      logger.debug("Done.")
    })
    .catch((err) => {
      logger.error("An error occurred")
      logger.error(err)
      process.exit(1)
    })
}
