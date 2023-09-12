# @typedotenv/cli

CLI tool for typedotenv

[read more](../../README.md)

## Setup

```sh
npm install --save-dev @typedotenv/cli
```

_package.json_

```json
{
  "scripts": {
    "generate": "typedotenv generate -e production src/env.ts"
  }
}
```

## Usage

### `typedotnev generate`

Generate TypeScript code from `.env` .

### `typedotenv check`

Check if TypeScript code is up to date.

It is also useful to compare TS for development with `.env` for production.

### Options

```
Arguments:
  output-file                   Destination of TypeScript file (default:
                                "env.ts")

Options:
  -i --input <env_filepath>      .env file (e.g. .env.development)
  -e --env <environment>         .env file suffix (e.g. production ->
                                 .env.production)
  -d --dir <envfile_directory>   .env file directory path [default:CWD]
  --env-object <object>          Object provide env variable
                                 [default:process.env]
  --enable-type-assertion        Disable type assertion (`as string`)
  --disable-type-check           Disable runtime type-check
  --access-from-index-signature  Access from index signature
  --allow <allow_key>            Allow keys (If you specify this, you won't be
                                 able to use other keys) (default: [])
  --deny <deny_key>              Deny keys (default: [])
  --required <required_key>      Required keys (default: [])
```
