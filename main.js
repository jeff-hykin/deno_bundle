#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function dv{<#${/*'>/dev/null )` 2>/dev/null;dv() { #>
echo "1.35.3"; : --% ' |out-null <#';};v="$(dv)";d="$HOME/.deno/$v/bin/deno";if [ -x "$d" ];then exec "$d" run -q -A "$0" "$@";elif [ -f "$d" ];then chmod +x "$d" && exec "$d" run -q -A "$0" "$@";fi;bin_dir="$HOME/.deno/$v/bin";exe="$bin_dir/deno";has() { command -v "$1" >/dev/null; };if ! has unzip;then :;if ! has apt-get;then has brew && brew install unzip;else if [ "$(whoami)" = "root" ];then apt-get install unzip -y;elif has sudo;then echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;if [ "$ANSWER" =~ ^[Yy] ];then sudo apt-get install unzip -y;fi;elif has doas;then echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;if [ "$ANSWER" =~ ^[Yy] ];then doas apt-get install unzip -y;fi;fi;fi;fi;if ! has unzip;then echo "";echo "So I couldn't find an 'unzip' command";echo "And I tried to auto install it, but it seems that failed";echo "(This script needs unzip and either curl or wget)";echo "Please install the unzip command manually then re-run this script";exit 1;fi;if [ "$OS" = "Windows_NT" ];then target="x86_64-pc-windows-msvc";else :; case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; *) target="x86_64-unknown-linux-gnu" ;; esac;fi;deno_uri="https://github.com/denoland/deno/releases/download/v$v/deno-$target.zip";if [ ! -d "$bin_dir" ];then mkdir -p "$bin_dir";fi;if has curl;then curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri";elif has wget;then wget --output-document="$exe.zip" "$deno_uri";else echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them.";echo "Please install one of them";echo "Otherwise I have no way to install the missing deno version needed to run this code";fi;unzip -d "$bin_dir" -o "$exe.zip";chmod +x "$exe";rm "$exe.zip";exec "$d" run -q -A "$0" "$@"; #>}; $DenoInstall = "${HOME}/.deno/$(dv)"; $BinDir = "$DenoInstall/bin"; $DenoExe = "$BinDir/deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip"; $DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip"; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null; } Function Test-CommandExists { Param ($command); $oldPreference = $ErrorActionPreference; $ErrorActionPreference = "stop"; try {if(Get-Command "$command"){RETURN $true}} Catch {Write-Host "$command does not exist"; RETURN $false} Finally {$ErrorActionPreference=$oldPreference}; } if (Test-CommandExists curl) { curl -Lo $DenoZip $DenoUri; } else { curl.exe -Lo $DenoZip $DenoUri; } if (Test-CommandExists curl) { tar xf $DenoZip -C $BinDir; } else { tar.exe   xf $DenoZip -C $BinDir; } Remove-Item $DenoZip; $User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run -q -A "$PSCommandPath" @args; Exit $LastExitCode; <#
# */0}`;

// import { build } from "https://deno.land/x/esbuild@v0.18.17/mod.js"
import { build, stop } from "https://deno.land/x/esbuild@v0.24.0/mod.js"
// import { BuildOptions } from "https://deno.land/x/esbuild@v0.18.17/mod.js"
// import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts"
import { denoPlugins } from "https://esm.sh/jsr/@duesabati/esbuild-deno-plugin@0.1.0/mod.ts"
import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts"
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, dim, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.6.38/main/console.js"

// TODO:
    // --watch option
    // plugins from CLI
const nodeBuiltinImports = [
    "node:assert",
    "node:buffer",
    "node:child_process",
    "node:cluster",
    "node:crypto",
    "node:dgram",
    "node:dns",
    "node:domain",
    "node:events",
    "node:fs",
    "node:http",
    "node:https",
    "node:net",
    "node:os",
    "node:path",
    "node:punycode",
    "node:querystring",
    "node:readline",
    "node:stream",
    "node:string_decoder",
    "node:timers",
    "node:tls",
    "node:tty",
    "node:url",
    "node:util",
    "node:v8",
    "node:vm",
    "node:zlib",
]
const flags = parse(Deno.args, {
    boolean: [
        "help",
        "minify",
        "allowOverwrite",
        "splitting",
        "preserveSymlinks",
        "metafile",
        "write",
    ],
    string: [
        "charset",
    ],
    default: {
        charset: "utf8",
    },
})
const normal = flags._
delete flags._

if (flags.help) {
    console.log(`
${green.bold`options`}:
    ${cyan`outfile`}: ${yellow`string`}
        Documentation: https://esbuild.github.io/api/#outfile 
    ${cyan`entryPoints`}: ${yellow`string[] | Record<string, string> | { in: string, out: string }[]`}
        Documentation: https://esbuild.github.io/api/#entry-points 
    ${cyan`entryNames`}: ${yellow`string`}
        Documentation: https://esbuild.github.io/api/#entry-names 
    ${cyan`allowOverwrite`}: ${yellow`boolean`}
        Documentation: https://esbuild.github.io/api/#allow-overwrite 
    ${cyan`splitting`}: ${yellow`boolean`}
        Documentation: https://esbuild.github.io/api/#splitting 
    ${cyan`preserveSymlinks`}: ${yellow`boolean`}
        Documentation: https://esbuild.github.io/api/#preserve-symlinks 
    ${cyan`metafile`}: ${yellow`boolean`}
        Documentation: https://esbuild.github.io/api/#metafile 
    ${cyan`outdir`}: ${yellow`string`}
        Documentation: https://esbuild.github.io/api/#outdir 
    ${cyan`outbase`}: ${yellow`string`}
        Documentation: https://esbuild.github.io/api/#outbase 
    ${cyan`external`}: ${yellow`string[]`}
        Documentation: https://esbuild.github.io/api/#external 
    ${cyan`packages`}: ${yellow`'external'`}
        Documentation: https://esbuild.github.io/api/#packages 
    ${cyan`alias`}: ${yellow`Record<string, string>`}
        Documentation: https://esbuild.github.io/api/#alias 
    ${cyan`loader`}: ${yellow`{ [ext: string]: Loader }`}
        Documentation: https://esbuild.github.io/api/#loader 
    ${cyan`resolveExtensions`}: ${yellow`string[]`}
        Documentation: https://esbuild.github.io/api/#resolve-extensions 
    ${cyan`mainFields`}: ${yellow`string[]`}
        Documentation: https://esbuild.github.io/api/#main-fields 
    ${cyan`conditions`}: ${yellow`string[]`}
        Documentation: https://esbuild.github.io/api/#conditions 
    ${cyan`write`}: ${yellow`boolean`}
        Documentation: https://esbuild.github.io/api/#write 
    ${cyan`tsconfig`}: ${yellow`string`}
        Documentation: https://esbuild.github.io/api/#tsconfig 
    ${cyan`outExtension`}: ${yellow`{ [ext: string]: string }`}
        Documentation: https://esbuild.github.io/api/#out-extension 
    ${cyan`publicPath`}: ${yellow`string`}
        Documentation: https://esbuild.github.io/api/#public-path 
    ${cyan`chunkNames`}: ${yellow`string`}
        Documentation: https://esbuild.github.io/api/#chunk-names 
    ${cyan`assetNames`}: ${yellow`string`}
        Documentation: https://esbuild.github.io/api/#asset-names 
    ${cyan`inject`}: ${yellow`string[]`}
        Documentation: https://esbuild.github.io/api/#inject 
    ${cyan`banner`}: ${yellow`{ [type: string]: string }`}
        Documentation: https://esbuild.github.io/api/#banner 
    ${cyan`footer`}: ${yellow`{ [type: string]: string }`}
        Documentation: https://esbuild.github.io/api/#footer 
    ${""
        // ${cyan`stdin`}: ${yellow`StdinOptions`}
        //     Documentation: https://esbuild.github.io/api/#stdin 
        // ${cyan`plugins`}: ${yellow`Plugin[]`}
        //     Documentation: https://esbuild.github.io/plugins/ 
    }${cyan`absWorkingDir`}: ${yellow`string`}
        Documentation: https://esbuild.github.io/api/#working-directory 
    ${cyan`nodePaths`}: ${yellow`string[]; // The "NODE_PATH" variable from Node.js`}
        Documentation: https://esbuild.github.io/api/#node-paths

${green.bold`notes`}:
    Some options (ex: aliases) don't really work directly from the CLI
    Feel free to open up a github issue to get your option prioritized:
        https://github.com/jeff-hykin/deno_bundle/issues/new

${green.bold`examples`}:
    ${green`deno_bundle`} my_file.js
    ${green`deno_bundle`} my_file.js --minify
    ${green`deno_bundle`} my_file.js ${cyan`--outfile`} my_file.bundle.js
    ${green`deno_bundle`} my_file.js ${cyan`--mainFields`} '["field1", "field2"]'
    ${green`deno_bundle`} my_file.js ${cyan`--charset`} ascii
`)
} else {
    const stringArrays = [
        "external",
        "resolveExtensions",
        "mainFields",
        "conditions",
        "inject",
        "entryPoints",
        "nodePaths",
        "alias",
    ]
    for (const [key, value] of Object.entries(stringArrays)) {
        if (typeof flags[key] == 'string') {
            flags[key] = JSON.parse(value)
        }
    }
    delete flags.help
    await build({
        bundle: true,
        entryPoints: normal,
        jsxFactory: "h",
        format: "esm",
        plugins: [
            {
                "name": "exit-on-build",
                "setup": (build) => {
                    build.onEnd((result) => {
                        Deno.stdout.write(result.outputFiles[0].contents)
                        stop().catch()
                        Deno.exit(result.errors.length)
                    })
                },
            },
            ...denoPlugins()
        ],
        ...flags,
        external: [
            // ...nodeBuiltinImports,
            ...(flags?.external||[])
        ]
    })
}