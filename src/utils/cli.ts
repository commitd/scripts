import { command } from "bandersnatch"

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
