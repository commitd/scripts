# Export LastPass

This script will export your lastpass account.

The output is a csv, which is encypted with a password which is pushed back to LastPass.

The user should put the encrypted data into a safe location and copy the password out of LastPass.

These should not be kept together (or under the same protection.

## Usage

This requires the lpass command

```
# Note this is installed in toolbox
sudo apt get install lastpass-cli gnupg
```

You should log into LastPass before use:

```
lpass login
```

Then run the command and follow prompts:

```
./export-lastpass
```
