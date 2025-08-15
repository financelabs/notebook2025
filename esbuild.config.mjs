import * as esbuild from 'esbuild';
import { globalExternals } from "@fal-works/esbuild-plugin-global-externals";
//import mdx from '@mdx-js/esbuild'
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as ReactBootstrap from "react-bootstrap"
// import * as RTK from "@reduxjs/toolkit";
// import * as ReactRedux from "react-redux"

/** Mapping from module paths to global variables */

const globals = {
    "react": {
        varName: "React",
        namedExports: Object.keys(React).filter((key) => key !== "default"),
    },
    "react-dom/client": {
        varName: "ReactDOM",
        namedExports: Object.keys(ReactDOM).filter((key) => key !== "default"),
    },

    "react-bootstrap": {
        varName: "react-bootstrap",
        namedExports: Object.keys(ReactBootstrap).filter((key) => key !== "default"),
    },
    //  "RTK": {
    //     varName: "RTK",
    //     namedExports: Object.keys(RTK).filter((key) => key !== "default"),
    // },

    //  "react-redux": {
    //     varName: "react-redux",
    //     namedExports: Object.keys(ReactRedux).filter((key) => key !== "default"),
    // },
    
};



let res = await esbuild.build({
    entryPoints: [
        'src/esbuilds/currentesbuild.jsx',
    ],
    bundle: true,
   minify: true,
   packages: 'external',
    keepNames: true,
    sourcemap: true,
    outdir: 'esbuilds',
    legalComments: 'none',
    target: ['es2015'],
    external: ["react", "react-dom/client", "react-bootstrap"],
    plugins: [
//        mdx(), // Add the markdown plugin
        globalExternals(globals)
    ],
    alias: {
        react: "react",      
    },
})

console.log(res);


// let res2 = await esbuild.build({
//     entryPoints: [
//         'src/esbuilds/vkeconolabsoriginallibrary.js',
//      //   'src/utlities/unbundledreduxfirebasecrudservices.js',
//     ],
//     bundle: true,
//     minify: true,
//     keepNames: true,
//     sourcemap: true,
//     platform: 'browser',
//     globalName: 'vkeconolabsoriginallibrary',
//     outdir: '/econolabs/dist',
//  //   legalComments: 'none',
//     target: ['es6'],    
// })

// console.log(res2);


