#!/usr/bin/env -S deno run --allow-all
import { toCamelCase } from 'https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/flattened/to_camel_case.js'
import { FileSystem, glob } from "https://deno.land/x/quickr@0.8.6/main/file_system.js"

function createLocalPath(parent, url) {
    parent = parent.replace(/\/$/, "")
    const sourceOfImport = new URL(url)
    const localRelativePath = sourceOfImport.origin.slice(sourceOfImport.protocol.length).replace(/^\/+/,"") + sourceOfImport.pathname
    return `${parent}/${localRelativePath}.js`
}
let alreadyStarted = {}
function recursivelyVendor(text, source, newParent, {topLevel=false}={}) {
    const id = JSON.stringify([text,source])
    // prevent infinite loops
    if (alreadyStarted[id]) {
        return
    }
    alreadyStarted[id] = true
    let promises = []
    const base = new URL(source).origin
    const relativeBase = base + new URL(source).pathname.split("/").slice(0, -1).join("/")
    const targetPath = createLocalPath(newParent, source)
    const parentPath = FileSystem.parentPath(targetPath)
    // FIXME: this is a hack. Will have to do full parsing to get actual imports (see github/jeff-hykin/to-esm)
    text = text.replaceAll(/((?:import|export|from)\s+)("(?:[^"\\]|\\.)+"|'(?:[^'\\]|\\.)+')/g, (_, group1, group2)=>{
        let relativeImportKinda = eval(group2)
        const isRelative = relativeImportKinda.startsWith(".")
        const isAbsolute = relativeImportKinda.startsWith("/")
        // remove/fix the ./ or . 
        relativeImportKinda = isRelative ? relativeImportKinda.slice(1).replace(/^([^/])/,"/$1") : relativeImportKinda
        let url
        if (isRelative) {
            url = relativeBase + relativeImportKinda
        } else if (isAbsolute) {
            url = base + relativeImportKinda
        } else {
            // hopefully http/https/file
            url = relativeImportKinda
            if (url.startsWith("node:") || url.startsWith("npm:")) {
                console.warn(`got a node import: ${url}`)
                return `${group1}${JSON.stringify(url)}`
            }
            // convert JSR to ESM.sh
            if (url.startsWith("jsr:")) {
                url = `https://esm.sh/jsr/${url.slice(4)}`
            }

            // raw npm imports
            try {
                new URL(url)
            } catch (error) {
                console.warn(`got a bad import: ${url}`)
                return `${group1}${JSON.stringify(url)}`
            }
        }
        let outputLocation = createLocalPath(newParent, url)
        outputLocation = FileSystem.makeRelativePath({ from: parentPath, to: outputLocation })
        if (!outputLocation.startsWith(".")) {
            outputLocation = `./${outputLocation}`
        }
        promises.push(
            fetch(url).then(r=>r.text()).then((text)=>{
                recursivelyVendor(text, url, newParent)
            })
        )
        return `${group1}${JSON.stringify(outputLocation)}`
    })
    
    if (topLevel) {
        console.log(`entrypoint: ${targetPath}`)
    }
    promises.push(FileSystem.write({path:targetPath, data: text, overwrite: true}))
    return Promise.all(promises)
}

await recursivelyVendor(
    await fetch(Deno.args[0]).then(r=>r.text()),
    Deno.args[0],
    FileSystem.thisFolder + "/vendored.ignore/",
    {topLevel:true},
)