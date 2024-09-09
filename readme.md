## Deno Bundle Successor

This adapts esbuild to play nice with Deno and behave like `deno bundle`.
The main goal is to "just work" along with minimal config.

Note: this does not work with 3rd party npm modules, and likely will never support them in any form.

# Installation
```sh
deno install -n deno_bundle -Afr https://raw.githubusercontent.com/jeff-hykin/deno_bundle/master/main.js
```

# Usage
```sh
deno_bundle --help
deno_bundle ./something.js > something.bundle.js
deno_bundle https://esm.sh/something > something.bundle.js
deno_bundle ./something.js --minify > something.bundle.js
deno_bundle ./something.js --outfile something.bundle.js
# force ASCII output
deno_bundle ./something.js --charset ascii
```
