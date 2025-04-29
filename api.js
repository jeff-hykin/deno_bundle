// import { build } from "https://deno.land/x/esbuild@v0.18.17/mod.js"
// import { build, context, stop } from "https://deno.land/x/esbuild@v0.24.0/mod.js"
// import { build, context, stop } from "https://esm.sh/esbuild-wasm@0.18.17"
import { build, stop, context } from "https://deno.land/x/esbuild@v0.24.0/mod.js"
// import { build, stop, context } from "/Users/jeffhykin/repos/neuron_playground/esbuild.js"
// import { BuildOptions } from "https://deno.land/x/esbuild@v0.18.17/mod.js"
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts"
// import { denoPlugins } from "https://esm.sh/jsr/@duesabati/esbuild-deno-plugin@0.1.0/mod.ts"

export async function bundle(entryPoints, {watch, outfile}={}, esbuildOptions={}) {
    if (typeof entryPoints == "string") {
        entryPoints = [entryPoints]
    }
    delete esbuildOptions.help
    delete esbuildOptions._
    if (!watch) {
        let {promise, resolve, reject} = Promise.withResolvers()
        await build({
            bundle: true,
            write: false,
            entryPoints: entryPoints,
            jsxFactory: "h",
            format: "esm",
            plugins: [
                {
                    "name": "exit-on-build",
                    "setup": (build) => {
                        build.onEnd((result) => {
                            if (outfile) {
                                Deno.writeFile(outfile, result.outputFiles[0].contents).finally(() =>stop().then(resolve).catch(reject))
                            } else {
                                Deno.stdout.write(result.outputFiles[0].contents)
                                stop().then(resolve).catch(reject)
                            }
                        })
                    },
                },
                ...denoPlugins()
            ],
            ...esbuildOptions,
            external: [
                // ...nodeBuiltinImports,
                ...(esbuildOptions?.external||[])
            ]
        })
        return promise
    } else {
        const ctx = await context({
            bundle: true,
            write: false,
            entryPoints: entryPoints,
            jsxFactory: "h",
            format: "esm",
            plugins: [
                {
                    "name": "exit-on-build",
                    "setup": (build) => {
                        build.onEnd((result) => {
                            Deno.writeFile(outfile, result.outputFiles[0].contents).catch(console.error)
                        })
                    },
                },
                ...denoPlugins()
            ],
            ...esbuildOptions,
            external: [
                // ...nodeBuiltinImports,
                ...(esbuildOptions?.external||[])
            ]
        })
        await ctx.watch()
    }
}