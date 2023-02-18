# unplugin-typedotenv

typedotenv with [unplugin](https://github.com/unjs/unplugin).

You can generate TypeScript code from `.env` file.
When you edit the `.env` file, the file is re-created.

[read more](../../README.md)

## Setup

```sh
npm install --save-dev unplugin-typedotenv
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import typedotenv from 'unplugin-typedotenv/vite'
export default defineConfig({
  plugins: [typedotenv({ output: 'src/env.ts' })],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import typedotenv from 'unplugin-typedotenv/rollup'
export default {
  plugins: [typedotenv({ output: 'src/env.ts' })],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
build({
  plugins: [require('unplugin-typedotenv/esbuild')({ output: 'src/env.ts' })],
})
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [require('unplugin-typedotenv/webpack')({ output: 'src/env.ts' })],
}
```

<br></details>
