[![](https://github.com/leap-protocol/leap-cli/workflows/L3aP-CLI%20Testing/badge.svg)](https://github.com/leap-protocol/leap-cli/)

* [Specification documentation](https://leap-protocol.github.io/)
* [L3aP for Javascript](https://leap-protocol.github.io/leap-js)
* [L3aP for Python](https://leap-protocol.github.io/leap-py)

# leap-cli

A command line tool for the L3aP protocol.

# Installation

`npm install leap-cli -g`

# Usage

## Generate

Generate a default L3aP configuration file

`leap generate filename`

File names can have extension .yaml .json or .toml.

Example:

```
> leap generate config.json
Wrote config file to config.json
SUCCESS
```

## Verify

Verify the contents of your configuration file

`leap verify configfile`

Files can have extension .yaml .json or .toml.

Example:

```
> leap verify config.json
Verification of configuration passed
SUCCESS
```

## Encode

Encode a packet based on a configuration file

`leap encode configfile category address --payload payload`

Example:
```
> leap encode config.json set item-1/child-1 --payload 10 1024.125
Encoded Packet ( set, item-1/child-1, [10,1024.125]):
   S0001:0a:44800400
SUCCESS
```

## Decode

Decode a packet based on a config file

`leap decode configfile packet`

Example:
```
> leap decode config.json S0001:0a:44800400
Decoded Packet S0001:0a:44800400:
   category - set
   item item-1/child-1/grand-child-1 = 10
   item item-1/child-1/grand-child-2 = 1024.125
SUCCESS
```

## Help

`leap --help`

# Exit Codes

On success, all commands return an exit code of 0.

On failure, all commands return a non-zero exit code.


