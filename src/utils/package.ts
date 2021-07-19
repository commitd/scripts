import { logger } from "./logger"
import path from "path"
import fs from "fs"

const packageJsonDir = path.resolve(__dirname, "../..")

export function findFileInPackage(...paths: string[]): string | undefined {
  const scriptsBaseDir = packageJsonDir || process.env.INIT_CWD || process.cwd()
  const file = path.join(...[scriptsBaseDir, ...paths])

  if (!fs.existsSync(file)) {
    logger.error(
      "File does not exist in package: %s in %s",
      path.join(...paths),
      scriptsBaseDir
    )
    return undefined
  }

  return path.resolve(file)
}
