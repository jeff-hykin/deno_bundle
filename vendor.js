#!/usr/bin/env -S deno run --allow-all
let baseText = fetch("https://esm.sh/@codemirror/lang-yaml?dev").then(r=>r.text())
import { toCamelCase } from 'https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/flattened/to_camel_case.js'
import { FileSystem, glob } from "https://deno.land/x/quickr@0.8.6/main/file_system.js"

function createLocalPath(parent, url) {
    parent = parent.replace(/\/$/, "")
    const sourceOfImport = new URL(url)
    const localRelativePath = sourceOfImport.origin.slice(sourceOfImport.protocol.length+2) + sourceOfImport.pathname
    return `${parent}/${localRelativePath}`
}
let alreadyStarted = {}
function recursivelyVendor(text, source, newParent) {
    const id = JSON.stringify([text,source])
    // prevent infinite loops
    if (alreadyStarted[id]) {
        return
    }
    alreadyStarted[id] = true
    let promises = []
    const base = new URL(source).origin
    const relativeBase = base + new URL(source).pathname.split("/").slice(0, -1).join("/")
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
            // hopefully http/https
            url = relativeImportKinda
            if (url.startsWith("node:")) {
                console.warn(`got a node import: ${url}`)
                return `${group1}${JSON.stringify(url)}`
            }
        }
        let outputLocation = createLocalPath(newParent, url)
        promises.push(
            fetch(url).then(r=>r.text()).then((text)=>{
                recursivelyVendor(text, url, newParent)
            })
        )
        return `${group1}${JSON.stringify(outputLocation)}`
    })

    const targetPath = createLocalPath(newParent, source)
    promises.push(FileSystem.write({path:targetPath, data: text, overwrite: true}))
    return Promise.all(promises)
}

await recursivelyVendor(
    await fetch(Deno.args[0]).then(r=>r.text()),
    Deno.args[0],
    FileSystem.thisFolder + "/vendored/",
)