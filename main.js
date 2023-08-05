import { build } from "https://deno.land/x/esbuild@v0.18.17/mod.js"
import { httpImports } from "https://deno.land/x/esbuild_plugin_http_imports@v1.3.0/index.ts"
import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts"

const flags = parse(Deno.args, {
    boolean: [],
    string: [],
    default: {},
})

const normal = flags._
delete flags._

const { outputFiles } = await build({
    bundle: true,
    entryPoints: normal,
    jsxFactory: "h",
    format: "esm",
    plugins: [
        httpImports()
    ],
    // write: false,
    ...flags,
})
Deno.exit()

// var output = await build({
//     bundle: true,
//     entryPoints: [ "main.js" ],
//     format: "esm",
//     plugins: [
//         httpImports()
//     ],
// })

// await build({
//     entryPoints: ["my_silly_wasm_cli.ts"],
//     bundle: true,
//     loader: {
//         ".wasm": "binary",
//     },
    // format: "esm",
//     outfile: "bin/my_silly_wasm_cli_bundle.js",
//     plugins: [
//         {
//             name: "exit-on-build",
//             setup: (build: PluginBuild) => {
//                 build.onEnd((result: BuildResult) => {
//                     Deno.exit(result.errors.length)
//                 })
//             },
//         },
//         httpImports(),
//     ],
//     minify: prod,
//     treeShaking: prod,
// })
