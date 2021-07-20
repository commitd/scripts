# Scripts

Scripts which have utility across many repositories.

This can be used either as a command `npx github:commitd/scripts command arguments --options` or you can use it interactively (REPL) by omitting the SCRIPT name `npx github:commitd/scripts`.

Note that the `python` and `shell` commands have limitations in REPL mode. You must quote your options:

- `npx github:commitd/scripts python script --option` when using command line.
- but `npx github:commitd/scripts` then `python script "--option"` in REPL.

## Use

Exact use depends on the script implementation language.

If the script is Node based (in the `src` directory) then it can be run through `npx`.

```bash
# Assume you have NodeJS

# Via npx

npx github:commitd/scripts command args

# Or if you are developing a node project:

npm install -D commitd/scripts
npm exec scripts
# Or with yarn:
yarn add -D commitd/scripts
yarn scripts
```

If the script is Python then you will need to clone it and install requirements:

```bash
# Use the npx shortcut
# Note the argument are in quotes!
npx github:commitd/scripts python SCRIPT


# Or clone and use directly
# Assume you have python3, pip3 and git!
git clone https://github.com/commitd/scripts.git
cd python/SCRIPT
pip3 install -r requirements.txt
./SCRIPT.py
```

If the script is Python then you will need to clone it and install requirements:

```bash
# Use via npx shortcut
# Note argument and options are in quotes
npx github:commitd/scripts shell SCRIPT your_arguments --your-options

# Or clone and run directly:

git clone https://github.com/commitd/scripts.git
cd bash/SCRIPT
./SCRIPT
```

I

## Contributing and developing

Each script should:

- Have an entry below explain it.
- Be in it's own directory (either within src is NodeJS/Typescript, or in a top level directory)
- Be executable through npx (which means it see) or some other simple means as above.
- Have minimal dependencies, since it'll be npm installed so large dependencies will be slow. Because this a single repo, with multiple packages, npx will install all dependencies.
- For bash scripts (with don't have a package manager) they should.
- Have sufficient help inbuilt (eg with arg parsing library) that is obvious what it does and how to use it.
- Be sufficiently complete enough that anyone else could use it. (e.g. if it was a script your username shouldn't be hard coded in it)

When you add a snippet, update the list in this README to point to it.

Scripts should run on any typical version of bash (generally on macos and linux), Python3 or Node16 / LTS with Typescript.

We wish to minimize the number of dependencies (all of which need to be pulled in via `npx`):

- Try to use whatever libraries other existing scripts where possible. For example, if scripts are using got as a http client there is no reason to introduce axios to do the same function. If a library has been superceded then an issue should be raised to place all scripts.
- Don't introduce entire libraries for a single function.
- Review the transitive dependencies you are added, what are they pulling in?
- Do not introduce libraries niche requirements. If these are so niche, perhaps they project specific?

## Shell scripts

- [Example](/shell/example) an example hello world script just for testing.
- [Save Docker Images](/shell/save-docker-images): Save a list of Docker images, e.g. for upload to client.
- [Export and Encrypt LastPass](./shell/export-lastpass): Export your LastPass vault and encrypt it for backup.

## Python scripts

- [Example](/python/example) an example hello world script just for testing.
- [Sharepoint upload](/python/sharepoint-upload): A Python script to upload files to Sharepoint (particularly to Committed External). This could be useful in GitHub Actions delivery pipelines.

## NodeJS scripts

- [Example](/src/example-command) an example hello world script just for testing.
- [Sonar](/src/sonar-command) run sonar analysis and uploads to SonarCloud supporting GitHub and workspaces.

Note that under `src` are `python-command` and `shell-command` which run the Python and Shell scripts as above.
