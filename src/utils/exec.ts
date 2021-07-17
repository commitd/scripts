import execa from "execa"

export type ExecOptions = {
  env: NodeJS.ProcessEnv
  // In millis
  timeout: number
  pipe: boolean
}

export type ExecResult = {
  exitCode: number
  stdio: string
  stderr: string
}

export const DEFAULT_EXEC_OPTIONS: ExecOptions = {
  env: {},
  timeout: 0,
  pipe: true,
}

export async function exec(
  command: string,
  args: string[] = [],
  options: ExecOptions = DEFAULT_EXEC_OPTIONS
): Promise<ExecResult> {
  const execaOptions: execa.Options<string> = {
    cleanup: true,
    extendEnv: true,
    env: options.env,
    timeout: options.timeout || 0,
  }

  const e = execa(command, args, execaOptions)
  if (e.stdout) {
    e.stdout.pipe(process.stdout)
  }

  if (e.stderr) {
    e.stderr.pipe(process.stdin)
  }

  if (e.stdin) {
    process.stdin.pipe(e.stdin)
  }

  const r = await e

  if (e.stdin) {
    process.stdin.unpipe(e.stdin)
  }

  return {
    exitCode: r.exitCode,
    stdio: r.stdout ?? "",
    stderr: r.stderr ?? "",
  }
}
