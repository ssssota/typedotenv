# @typedotenv/cli

CLI tool for typedotenv

## Usage

```
Usage: typedotenv generate [options] [output-file]

Arguments:
  output-file                   Destination of TypeScript file (default:
                                "env.ts")

Options:
  -i --input <env_filepath>     .env file (e.g. .env.development)
  -e --env <environment>        .env file suffix (e.g. production ->
                                .env.production)
  -d --dir <envfile_directory>  .env file directory path [default:CWD]
  -h, --help                    display help for command
```

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
