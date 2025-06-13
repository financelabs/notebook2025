import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
//import rehypeKatex from 'rehype-katex';
import addClasses from 'rehype-add-classes';
import remarkCard from "remark-card";
import remarkDirective from "remark-directive";
//import postcss from 'rollup-plugin-postcss';
import external from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import typescript from "@rollup/plugin-typescript";
import jsx from 'acorn-jsx';
import cleanup from 'rollup-plugin-cleanup';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
//import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import resolve from '@rollup/plugin-node-resolve';






//https://blog.logrocket.com/how-to-build-component-library-react-typescript/


export default [

      {
      input: "src/utlities/unbundledbasicfirebasecrudservices.js",
      output: [
         {
            file: 'src/cdnreact/dist/basicfirebasecrudservices.js',
            format: 'umd',
            name: "basicfirebasecrudservices",
            sourcemap: true,
         },
      ],
      plugins: [
         injectProcessEnv({
            NODE_ENV: 'production' // 'production'
         }),
         commonjs(),
         babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            //    presets: [['@babel/preset-react', { "runtime": "classic" }]],
            extensions: ['.js', '.jsx']
         }),
         resolve({ extensions: ['.js', '.jsx'] }),

           terser()
      ],

   },

        {
      input: 'src/econolabs/bookkeeping/index.jsx',
      output: {
         file: 'econolabs/bookkeeping/allinonebookkeeping.js',
         format: 'iife'
      },
      plugins: [
         nodeResolve({
            extensions: ['.js', '.jsx']
         }),
         babel({
            babelHelpers: 'bundled',
            presets: ['@babel/preset-react'],
            extensions: ['.js', '.jsx']
         }),
         commonjs(),
         replace({
            preventAssignment: false,
            'process.env.NODE_ENV': '"development"'
         })
      ]
   },


   //          {
   //    input: 'src/econolabs/editbookkeeping/index.jsx',
   //    output: {
   //       file: 'econolabs/editbookkeeping/allinoneeditbookkeeping.js',
   //       format: 'iife'
   //    },
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),
   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: ['@babel/preset-react'],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       })
   //    ]
   // },


    



   //    {
   //    input: 'src/econolabs/myquiz/index.jsx',
   //    output: {
   //       file: 'econolabs/myquiz/allinonemyquiz.js',
   //       format: 'iife'
   //    },
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),
   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: ['@babel/preset-react'],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       })
   //    ]
   // },

   // {
   //    input: 'src/econolabs/fundamentals/index.jsx',
   //    output: {
   //       file: 'econolabs/fundamentals/allinonefundamentals.js',
   //       format: 'iife'
   //    },
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),
   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: ['@babel/preset-react'],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       })
   //    ]
   // },



   // {
   //    input: 'src/econolabs/updateopenquizescases/index.jsx',
   //    output: {
   //       file: 'econolabs/updateopenquizescases/allinoneupdateopenquizescases.js',
   //       format: 'iife'
   //    },
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),
   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: ['@babel/preset-react'],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       })
   //    ]
   // },


   // {
   //    input: 'src/econolabs/businessbudgeting/index.jsx',
   //    output: {
   //       file: 'econolabs/businessbudgeting/allinonebusinessbudgeting.js',
   //       format: 'iife'
   //    },
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),
   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: ['@babel/preset-react'],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       })
   //    ]
   // },

   



   // {
   //    input: 'src/econolabs/selectusersquizesbydate/index.jsx',
   //    output: {
   //       file: 'econolabs/selectusersquizesbydate/allinoneselectusersquizesbydate.js',
   //       format: 'iife'
   //    },
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),
   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: ['@babel/preset-react'],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       })
   //    ]
   // },

   


   // {
   //    input: 'src/econolabs/accountingcases/index.jsx',
   //    output: {
   //       file: 'econolabs/accountingcases/allinoneaccountingcases.js',
   //       format: 'iife'
   //    },
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),
   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: ['@babel/preset-react'],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       })
   //    ]
   // },


   // {
   //    input: 'src/econolabs/print/index.jsx',
   //    output: {
   //       file: 'econolabs/print/allinoneprint.js',
   //       format: 'iife'
   //    },
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),
   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: ['@babel/preset-react'],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       })
   //    ]
   // },


   








   

   // {
   //    input: "econolabs/quiz/unbundledeconolabsreactcomponents.js",
   //    output: [
   //       {
   //          file: 'dist/econolabsreactcomponents.js',
   //          format: 'iife',
   //          name: "econolabsreactcomponents",
   //          sourcemap: true,
   //          globals: {
   //             'react': 'React',
   //          },
   //       }],
   //    plugins: [
   //       babel({
   //          babelHelpers: 'bundled',
   //          exclude: 'node_modules/**',
   //          presets: [['@babel/preset-react', { "runtime": "classic" }]],
   //          extensions: ['.js', '.jsx']
   //      }),
   //       external(),
   //       resolve({ extensions: ['.js', '.jsx'] }),
   //       commonjs(),

   //       terser()
   //    ],
   //    external: ['redux', 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },



   // {
   //    input: 'src/econolabs/quiz/index.jsx',
   //    output: {
   //       file: 'econolabs/quiz/allinonequiz.js',
   //       format: 'iife'
   //    },
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),
   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: ['@babel/preset-react'],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       })
   //    ]
   // },


   // {
   //    input: "econolabs/quiz/quiz.js",
   //    output: [
   //       {
   //          file: 'econolabs/quiz/index.js',
   //          format: 'iife',
   //          sourcemap: true,
   //          name: "quiz",
   //          globals: {
   //             'react': 'React',
   //          },
   //       }],
   //    plugins: [
   //       babel({
   //          babelHelpers: 'bundled',
   //          exclude: 'node_modules/**',
   //          presets: [['@babel/preset-react', { "runtime": "classic" }]],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       external(),
   //       resolve({ extensions: ['.js', '.jsx'] }),
   //       commonjs(),
   //       //   terser()
   //    ],
   //    external: ['redux', 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },



   // {
   //    input: "econolabs/quizcardwithstorage/basicfirebasecrudservices.js",
   //    output: [
   //       {
   //          file: 'econolabs/quizcardwithstorage/bundledbasicfirebasecrudservices.js',
   //          format: 'iife',
   //          global: "bundledbasicfirebasecrudservices",
   //          sourcemap: true,
   //          globals: {
   //             'react': 'React',
   //          },
   //       }],
   //    plugins: [
   //       babel({
   //          babelHelpers: 'bundled',
   //          exclude: 'node_modules/**',
   //          presets: [['@babel/preset-react', { "runtime": "classic" }]],
   //          extensions: ['.js', '.jsx']
   //      }),
   //       external(),
   //       resolve({ extensions: ['.js', '.jsx'] }),
   //       commonjs(),         
   //       terser()
   //    ],
   //    external: ['redux', 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },

   // {
   //    input: "econolabs/quizcardwithstorage/econolabsreactcomponents.js",
   //    output: [
   //       {
   //          file: 'econolabs/quizcardwithstorage/bundledeconolabsreactcomponents.js',
   //          format: 'iife',
   //          global: "bundledeconolabsreactcomponents",
   //          sourcemap: true,
   //          globals: {
   //             'react': 'React',
   //          },
   //       }],
   //    plugins: [
   //       babel({
   //          babelHelpers: 'bundled',
   //          exclude: 'node_modules/**',
   //          presets: [['@babel/preset-react', { "runtime": "classic" }]],
   //          extensions: ['.js', '.jsx']
   //      }),
   //       external(),
   //       resolve({ extensions: ['.js', '.jsx'] }),
   //       commonjs(),

   //       terser()
   //    ],
   //    external: ['redux', 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },

   // {
   //    input: "econolabs/quizcardwithstorage/index.js",
   //    output: [
   //       {
   //          file: 'econolabs/quizcardwithstorage/quizcardwithstorage.js',
   //          format: 'iife',
   //          global: "quizcardwithstorage",
   //          sourcemap: true,
   //          globals: {
   //             'react': 'React',
   //          },
   //       }],
   //    plugins: [
   //       babel({
   //          babelHelpers: 'bundled',
   //          exclude: 'node_modules/**',
   //          presets: [['@babel/preset-react', { "runtime": "classic" }]],
   //          extensions: ['.js', '.jsx']
   //      }),
   //       external(),
   //       resolve({ extensions: ['.js', '.jsx'] }),
   //       commonjs(),

   //       terser()
   //    ],
   //    external: ['redux', 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },



   // {
   //    input: "src/tsccomponents/index.ts",
   //    output: [
   //       {
   //          file: 'dist/econolabsreactcomponents/umd/index.js',
   //          format: 'umd',
   //          name: "econolabsreactcomponents",
   //          sourcemap: true,
   //          globals: {
   //             'react': 'React',
   //          },
   //       }],
   //    plugins: [
   //       nodeResolve(),
   //       babel({
   //          exclude: 'node_modules/**',
   //          presets: [
   //             '@babel/preset-react', {
   //                "runtime": "classic"
   //              },
   //             '@babel/preset-typescript'
   //          ]
   //       }),
   //       external(),
   //       commonjs(),
   //       typescript({ tsconfig: './tsconfig.json' })
   //    ],
   //    external: ['redux', 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },

   // {
   //    input: 'src/vanillajs/econolabs/basicfirebasecrudservices/index.js',
   //    output: [
   //       {
   //          file: 'dist/basicfirebasecrudservices.js',
   //          format: 'iife',
   //          name: "basicfirebasecrudservices"
   //       },
   //    ],
   //    plugins: [
   //       injectProcessEnv({
   //          NODE_ENV: 'production' // 'production'
   //       }),
   //       nodeResolve(),
   //       commonjs(),
   //       terser({ format: { comments: false } })
   //    ],

   // },


   // {
   //    input: './src/components/cdncomponents/templatebootstrapicontextcrud/index.js',
   //    output: {
   //       file: 'templates/dist/templatebootstrapicontextcrud.js',
   //       name: "templatebootstrapicontextcrud",
   //       format: 'iife',
   //       sourcemap: true,
   //       globals: {
   //          'react': 'React',
   //          'redux': 'Redux',
   //          'react-dom/client': 'ReactDOM',
   //          'react/jsx-runtime': "jsxRuntime",
   //          'react-dom': "ReactDOM",
   //          'react-bootstrap/Button': "ReactBootstrap.Button",
   //          'react-bootstrap/Card': "ReactBootstrap.Card"
   //       },
   //    },
   //    jsx: 'react',
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),

   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: [

   //             ["@babel/preset-react", {
   //                //   "pragma": "dom", // default pragma is React.createElement (only in classic runtime)
   //                //   "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
   //                //   "throwIfNamespace": false, // defaults to true
   //                "runtime": "classic", // defaults to classic
   //                //   "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
   //             }]],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       }),
   //       terser({
   //          format: {
   //             comments: false
   //          },
   //       })

   //       //  cleanup()
   //    ],
   //    external: ['redux', 'react', "React", 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },



   // {
   //    input: './src/components/cdncomponents/templatevkuicontextcrud/index.js',
   //    output: {
   //       file: 'templates/dist/templatevkuicontextcrud.js',
   //       name: "templatevkuicontextcrud",
   //       format: 'iife',
   //       sourcemap: true,
   //       globals: {
   //          'react': 'React',
   //          'redux': 'Redux',
   //          'react-dom/client': 'ReactDOM',
   //          'react/jsx-runtime': "jsxRuntime",
   //          'react-dom': "ReactDOM",
   //          'react-bootstrap/Button': "ReactBootstrap.Button",
   //          'react-bootstrap/Card': "ReactBootstrap.Card"
   //       },
   //    },
   //    jsx: 'react',
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),

   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: [

   //             ["@babel/preset-react", {
   //                //   "pragma": "dom", // default pragma is React.createElement (only in classic runtime)
   //                //   "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
   //                //   "throwIfNamespace": false, // defaults to true
   //                "runtime": "classic", // defaults to classic
   //                //   "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
   //             }]],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       }),
   //       terser({
   //          format: {
   //             comments: false
   //          },
   //       })

   //       //  cleanup()
   //    ],
   //    external: ['redux', 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },







   // {
   //    input: 'src/vanillajs/econolabs/authfirebasecrudservices/index.js',
   //    output: [


   //       {
   //          file: 'templates/dist/authfirebasecrudservices.js',
   //          format: 'iife',
   //          name: "authfirebasecrudservices"
   //       },
   //    ],
   //    plugins: [
   //       injectProcessEnv({
   //          NODE_ENV: 'production'
   //       }),
   //       nodeResolve(),
   //       commonjs(),
   //       terser({ format: { comments: false } })
   //    ]
   // },

   // {
   //    input: './src/components/cdncomponents/templatefirebaseauthreactredux/index.js',
   //    output: {
   //       file: 'templates/dist/templatefirebaseauthreactredux.js',
   //       format: 'iife',
   //       sourcemap: true,
   //       globals: {
   //          'react': 'React',
   //          'redux': 'Redux',
   //          'react-dom/client': 'ReactDOM',
   //          'react/jsx-runtime': "jsxRuntime",
   //          'react-dom': "ReactDOM",
   //          'react-bootstrap/Button': "ReactBootstrap.Button",
   //          'react-bootstrap/Card': "ReactBootstrap.Card"
   //       },
   //    },
   //    jsx: 'react',
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),

   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: [

   //             ["@babel/preset-react", {
   //                //   "pragma": "dom", // default pragma is React.createElement (only in classic runtime)
   //                //   "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
   //                //   "throwIfNamespace": false, // defaults to true
   //                "runtime": "classic", // defaults to classic
   //                //   "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
   //             }]],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       }),
   //       terser({
   //          format: {
   //             comments: false
   //          },
   //       })

   //       //  cleanup()
   //    ],
   //    external: ['redux', 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },






   // {
   //    input: './src/components/templatereducercontext.js',
   //    output: {
   //       file: 'dist/templatereducercontext.js',
   //       format: 'iife',
   //       sourcemap: true,
   //       globals: {
   //          'react': 'React',
   //          'react-dom/client': 'ReactDOM',
   //          'react/jsx-runtime': "jsxRuntime",
   //          'react-dom': "ReactDOM",
   //          'react-bootstrap/Button': "ReactBootstrap.Button",
   //          'react-bootstrap/Card': "ReactBootstrap.Card"
   //       },
   //    },
   //    jsx: 'react',
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),

   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: [

   //             ["@babel/preset-react", {
   //                //   "pragma": "dom", // default pragma is React.createElement (only in classic runtime)
   //                //   "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
   //                //   "throwIfNamespace": false, // defaults to true
   //                "runtime": "classic", // defaults to classic
   //                //   "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
   //             }]],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       }),
   //       terser({
   //          format: {
   //             comments: false
   //          },
   //       })

   //       //  cleanup()
   //    ],
   //    external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },


   // {
   //    input: './src/components/templatereactredux.js',
   //    output: {
   //       file: 'dist/templatereactredux.js',
   //       format: 'iife',
   //       sourcemap: true,
   //       globals: {
   //          'react': 'React',
   //          'redux': 'Redux',
   //          'react-dom/client': 'ReactDOM',
   //          'react/jsx-runtime' : "jsxRuntime",
   //          'react-dom': "ReactDOM",
   //          'react-bootstrap/Button' : "ReactBootstrap.Button",
   //          'react-bootstrap/Card' : "ReactBootstrap.Card"
   //       },
   //    },
   //    jsx: 'react',
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),

   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: [

   //             ["@babel/preset-react", {
   //          //   "pragma": "dom", // default pragma is React.createElement (only in classic runtime)
   //          //   "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
   //          //   "throwIfNamespace": false, // defaults to true
   //             "runtime": "classic", // defaults to classic
   //          //   "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
   //          }]],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       }),
   //       terser({
   //          format: {
   //             comments: false
   //          },
   //       })

   //       //  cleanup()
   //    ],
   //    external: ['redux', 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },








   // {
   //    input: './src/components/cdnreactpostwithquizes.js',
   //    output: {
   //       file: 'dist/cdnreactpostwithquizes.js',
   //       format: 'iife',
   //       sourcemap: true,
   //       globals: {
   //          'react': 'React',
   //          'react-dom/client': 'ReactDOM',
   //          'react/jsx-runtime' : "jsxRuntime",
   //          'react-dom': "ReactDOM",
   //          'react-bootstrap/Button' : "ReactBootstrap.Button",
   //          'react-bootstrap/Card' : "ReactBootstrap.Card"
   //       },
   //    },
   //    jsx: 'react',
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),

   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: [

   //             ["@babel/preset-react", {
   //          //   "pragma": "dom", // default pragma is React.createElement (only in classic runtime)
   //          //   "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
   //          //   "throwIfNamespace": false, // defaults to true
   //             "runtime": "classic", // defaults to classic
   //          //   "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
   //          }]],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       }),
   //       terser({
   //          format: {
   //             comments: false
   //          },
   //       })

   //       //  cleanup()
   //    ],
   //    external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },










   // {
   //    input: './src/components/templatebuttoncounter.js',
   //    output: {
   //       file: 'templates/dist/templatebuttoncounter.js',
   //       format: 'iife',
   //       globals: {
   //          'react': 'React',
   //          'react-dom/client': 'ReactDOM',
   //          // 'react/jsx-runtime' : "jsxRuntime",
   //          'react-dom': "ReactDOM"
   //       },
   //    },
   //    jsx: 'react',
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),

   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: [
   //             // ...
   //             ["@babel/preset-react"], //, { runtime: "automatic" }
   //          ],

   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       }),
   //       terser({
   //          format: {
   //             comments: false
   //          },
   //       })

   //       //  cleanup()
   //    ],
   //    external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },


   // {
   //    input: './src/components/templatebuttoncounter.js',
   //    output: {
   //       file: 'templates/dist/templatebuttoncounter.js',
   //       format: 'iife',
   //       globals: {
   //          'react': 'React',
   //          'react-dom/client': 'ReactDOM',
   //          // 'react/jsx-runtime' : "jsxRuntime",
   //          'react-dom': "ReactDOM"
   //       },
   //    },
   //    jsx: 'react',
   //    plugins: [
   //       nodeResolve({
   //          extensions: ['.js', '.jsx']
   //       }),

   //       babel({
   //          babelHelpers: 'bundled',
   //          presets: [
   //             // ...
   //             ["@babel/preset-react"], //, { runtime: "automatic" }
   //          ],
   //          //    presets: ['@babel/preset-react', {
   //          //  "pragma": "dom", // default pragma is React.createElement (only in classic runtime)
   //          //  "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
   //          ///  "throwIfNamespace": false, // defaults to true
   //          //     runtime: "classic" // defaults to classic
   //          // "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
   //          //   }],
   //          extensions: ['.js', '.jsx']
   //       }),
   //       commonjs(),
   //       replace({
   //          preventAssignment: false,
   //          'process.env.NODE_ENV': '"development"'
   //       }),
   //       terser({
   //          format: {
   //             comments: false
   //          },
   //       })

   //       //  cleanup()
   //    ],
   //    external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },


   //  {
   //      input: 'src/components/rollupbabel.js',
   //      output: {
   //         file: 'templates/dist/bundle.js',
   //         format: 'iife',
   //         globals: {
   //                  'react': 'React',
   //                  'react-dom/client': 'ReactDOM'                    
   //                },
   //      },
   //      plugins: [
   //         nodeResolve({
   //            extensions: ['.js', '.jsx']
   //         }),
   //         babel({
   //            babelHelpers: 'bundled',
   //            presets: ['@babel/preset-react'],
   //            extensions: ['.js', '.jsx']
   //         }),
   //         commonjs(),
   //         replace({
   //            preventAssignment: false,
   //            'process.env.NODE_ENV': '"development"'
   //         }),

   //      ],
   //      external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   //   },




   // {
   //     input: './src/components/templatebuttoncounter.jsx',
   //     output: [
   //         {
   //             file: 'templates/dist/templatebuttoncounter.js',
   //             format: 'cjs',
   //             sourcemap: true,
   //             // globals: {
   //             //     'react': 'React',
   //             //     'react-dom': 'ReactDOM'                    
   //             //   },
   //         },
   //         {
   //             file: 'templates/dist/templatebuttoncounter.es.js',
   //             format: 'es',
   //             exports: 'named',
   //             sourcemap: true,
   //             // globals: {
   //             //     'react': 'React',
   //             //     'react-dom': 'ReactDOM'                    
   //             //   },
   //         }
   //     ],
   //     cornInjectPlugins: [jsx()],
   //     plugins: [
   //         external(),  //[ 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client']
   //         nodeResolve({ extensions: ['.js', '.jsx'] }),
   //         commonjs(),
   //         typescript({ tsconfig: "./tsconfig.json" }),
   //         // babel({
   //         //     babelHelpers: 'bundled',
   //         //     exclude: 'node_modules/**',
   //         //     presets: [['@babel/preset-react', { "runtime": "automatic" }]],
   //         //     extensions: ['.js', '.jsx']
   //         // }),
   //       //  terser()
   //     ],
   //     external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
   // },


   // {
   //     input: './src/components/quizcardlibrary.js',
   //     output: [
   //         {
   //             file: 'templates/dist/quizcardlibrary.js',
   //             format: 'cjs',
   //             sourcemap: true,
   //             globals: {
   //                 'react': 'React',
   //                 'react-dom': 'ReactDOM'                    
   //               },
   //         },
   //         {
   //             file: 'templates/dist/quizcardlibrary.es.js',
   //             format: 'es',
   //             exports: 'named',
   //             sourcemap: true,
   //             globals: {
   //                 'react': 'React',
   //                 'react-dom': 'ReactDOM'                    
   //               },
   //         }
   //     ],
   //     plugins: [
   //         commonjs(),
   //         nodeResolve({ extensions: ['.js', '.jsx'] }),
   //         external([ 'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client']),           

   //         babel({
   //             babelHelpers: 'bundled',
   //             exclude: 'node_modules/**',
   //             presets: [['@babel/preset-react', { "runtime": "automatic" }]],
   //             extensions: ['.js', '.jsx']
   //         }),
   //         terser()
   //     ]
   // },

   // {
   //     input: 'src/posts/withreactmarkdown.js',
   //     output: {
   //         file: 'public/withreactmarkdown.js',
   //         format: 'iife',
   //         name: 'withreactmarkdown',
   //         globals: {
   //             'react': 'React',
   //             'react-dom': 'ReactDOM'                    
   //           },
   //     },
   //     plugins: [
   //         nodeResolve({
   //             extensions: ['.js', '.jsx']
   //         }),
   //         babel({
   //             babelHelpers: 'bundled',
   //             presets: ['@babel/preset-react'],
   //             extensions: ['.js', '.jsx']
   //         }),
   //         commonjs(),
   //         postcss({
   //             extensions: ['.css'],
   //           }),
   //         replace({
   //             preventAssignment: false,
   //             'process.env.NODE_ENV': '"production"' //development
   //         })
   //     ],
   //     external: ['react', 'react-dom'],
   // },




   // {
   //     input: 'src/posts/example.js',
   //     output: {
   //         file: 'public/example.js',
   //         format: 'iife',
   //         name: 'example',
   //         globals: {
   //             'react': 'React',
   //             'react-dom': 'ReactDOM'                    
   //           },
   //     },
   //     plugins: [
   //         nodeResolve({
   //             extensions: ['.js', '.jsx']
   //         }),
   //         mdx({/* jsxImportSource: …, otherOptions… */
   //             remarkPlugins: [remarkGfm, remarkDirective],
   //             rehypePlugins: [[addClasses, {
   //                 table: 'table table-sm table-striped table-borderless table-responsive',
   //           //      p: ''
   //             }]]
   //         }),
   //         babel({
   //             babelHelpers: 'bundled',
   //             presets: ['@babel/preset-react'],
   //             extensions: ['.js', '.jsx', '.mdx', '.md']
   //         }),
   //         commonjs(),
   //         replace({
   //             preventAssignment: false,
   //             'process.env.NODE_ENV': '"development"' //development
   //         })
   //     ]
   // },

   // {
   //     input: 'src/components/vkui.js',
   //     output: {
   //         file: 'public/vkui.js',
   //         format: 'iife'
   //     },
   //     plugins: [
   //         nodeResolve({
   //             extensions: ['.js', '.jsx']
   //         }),
   //         babel({
   //             babelHelpers: 'bundled',
   //             presets: ['@babel/preset-react'],
   //             extensions: ['.js', '.jsx']
   //         }),
   //         commonjs(),
   //         replace({
   //             preventAssignment: false,
   //             'process.env.NODE_ENV': '"development"' //development
   //         })
   //     ]
   // },
   // {
   //     input: 'src/components/index.js',
   //     output: {
   //         file: 'public/bundle.js',
   //         format: 'iife'
   //     },
   //     plugins: [
   //         nodeResolve({
   //             extensions: ['.js', '.jsx']
   //         }),
   //         babel({
   //             babelHelpers: 'bundled',
   //             presets: ['@babel/preset-react'],
   //             extensions: ['.js', '.jsx']
   //         }),
   //         commonjs(),
   //         replace({
   //             preventAssignment: false,
   //             'process.env.NODE_ENV': '"development"' //development
   //         })
   //     ]
   // }
]