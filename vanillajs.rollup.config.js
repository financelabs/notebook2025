import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import commonjs from '@rollup/plugin-commonjs';
//import postcss from 'rollup-plugin-postcss';
//import builtins from 'rollup-plugin-node-builtins';
//import globals from 'rollup-plugin-node-globals';




export default [

	{
		input: 'src/vanillajs/econolabs/groupevaluation0425/index.js',
		output: {
			file: 'econolabs/pso319/groupevaluation.js',
			format: 'iife',
			name: "groupevaluation"
		},
		plugins: [
			injectProcessEnv({
				NODE_ENV: 'development' // 'development' // 'production'
			}),
			nodeResolve(),
			commonjs(),
		//	terser({format: { comments: false}})
		]
	},



	// 	{
	// 	input: 'src/vanillajs/econolabs/quizcardwithstorage23122024/index.js',
	// 	output: [

			
	// 		{
	// 			file: 'econolabs/dist/quizcardwithstorage.js',
	// 			format: 'iife',
	// 			name: "quizcardwithstorage"
	// 		},
	// 	],
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'production' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 		//	commonjs(),
	// 			terser({format: { comments: false}})
	// 	]
	// },


	

	// {
	// 	input: 'src/vanillajs/econolabs/groupopenquizes/index.js',
	// 	output: {
	// 		file: 'econolabs/dist/groupopenquizes.js',
	// 		format: 'iife',
	// 		name: "groupopenquizes"
	// 	},
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'development' // 'production'
	// 		}),
	// 	//	globals(),
	// 	//	builtins(),
	// 		commonjs(),
	// 		nodeResolve(),
		
	// 	//	terser({format: { comments: false}})
	// 	]
	// },











	// {
	// 	input: 'src/vanillajs/econolabs/quizcardwithstorage16122024/index.js',
	// 	output: [

	// 		{
	// 			file: 'econolabs/statistics4/quizcardwithstorage.js',
	// 			format: 'iife',
	// 			name: "quizcardwithstorage"
	// 		},

	// 		{
	// 			file: 'econolabs/dist/quizcardwithstorage.js',
	// 			format: 'iife',
	// 			name: "quizcardwithstorage"
	// 		},
	// 	],
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 		//	commonjs(),
	// 		//	terser({format: { comments: false}})
	// 	]
	// },

	
	// {
	// 	input: 'src/vanillajs/econolabs/currentday/index.js',
	// 	output: {
	// 		file: 'econolabs/currentday/currentday.js',
	// 		format: 'iife',
	// 		name: "currentday"
	// 	},
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 		//	terser({format: { comments: false}})
	// 	]
	// },


	// {
	// 	input: 'src/vanillajs/templates/opengroupscrud.js',
	// 	output: [
	// 		{
	// 			file: 'templates/dist/opengroupscrud.js',
	// 			format: 'iife',
	// 			name: "opengroupscrud"
	// 		},
	// 	],
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		postcss({
	// 			extensions: ['.css'],
	// 		  }),
	// 		nodeResolve(),
	// 		//	commonjs(),
	// 		//	terser({format: { comments: false}})
	// 	]
	// },

	


	// 	{
	// 	input: 'src/vanillajs/econolabs/bankaccounting/index.js',
	// 	output: {
	// 		file: 'econolabs/bankaccounting/bankaccounting.js',
	// 		format: 'iife',
	// 		name: "bankaccounting"
	// 	},
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'production' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 		terser({ format: { comments: false } })
	// 	]
	// },

	// 	{
	// 		input: 'src/vanillajs/econolabs/internship/index.js',
	// 		output: {
	// 			file: 'econolabs/internship/internship.js',
	// 			format: 'iife',
	// 			name: "internship"
	// 		},
	// 		plugins: [
	// 			injectProcessEnv({
	// 				NODE_ENV: 'development' // 'production'
	// 			}),
	// 			nodeResolve(),
	// //			terser({format: { comments: false}})
	// 		]
	// 	},


	// 		{
	// 		input: 'src/vanillajs/econolabs/viewquiztype/index.js',
	// 		output: {
	// 			file: 'econolabs/viewquiztype/viewquiztype.js',
	// 			format: 'iife',
	// 			name: "viewquiztype"
	// 		},
	// 		plugins: [
	// 			injectProcessEnv({
	// 				NODE_ENV: 'development' // 'production'
	// 			}),
	// 			nodeResolve(),
	// //			terser({format: { comments: false}})
	// 		]
	// 	},

















	// {
	// 	input: 'src/vanillajs/econolabs/regression/index.js',
	// 	output: {
	// 		file: 'econolabs/statistics4/regression.js',
	// 		format: 'iife',
	// 		name: "regression"
	// 	},
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 	//	terser({format: { comments: false}})
	// 	]
	// },




	// {
	// 	input: 'src/vanillajs/econolabs/updatemedia/index.js',
	// 	output: {
	// 		file: 'econolabs/development/updatemedia.js',
	// 		format: 'iife',
	// 		name: "updatemedia"
	// 	},
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 		terser({format: { comments: false}})
	// 	]
	// },





	// {
	// 	input: 'src/vanillajs/econolabs/mybook/index.js',
	// 	output: [
	// 		{
	// 			file: 'econolabs/dist/mybook.js',
	// 			format: 'iife',
	// 			name: "mybook"
	// 		}
	// 	],
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 	//	terser({format: { comments: false}})
	// 	]
	// },





	// {
	// 	input: 'src/vanillajs/econolabs/myworkbook/index.js',
	// 	output: [
	// 		{
	// 			file: 'econolabs/dist/myworkbook.js',
	// 			format: 'iife',
	// 			name: "myworkbook"				
	// 		}
	// 	],
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),

	// 	//	terser({format: { comments: false}})
	// 	]
	// },






	// {
	// 	input: 'src/vanillajs/econolabs/cleantext/index.js',
	// 	output: [
	// 		{
	// 			file: 'econolabs/dist/cleantext.js',
	// 			format: 'iife',
	// 			name: "cleantext",
	// 			globals: "sanitizeHtml"
	// 		}
	// 	],
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),		
	// 	//	terser({format: { comments: false}})
	// 	]
	// },






	// {
	// 	input: 'src/vanillajs/econolabs/addstudentstoopengroup/index.js',
	// 	output: [
	// 		{
	// 			file: 'econolabs/dist/addstudentstoopengroup.js',
	// 			format: 'iife',
	// 			name: "addstudentstoopengroup"
	// 		}
	// 	],
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 	//	terser({format: { comments: false}})
	// 	]
	// },








	// {
	// 	input: 'src/vanillajs/econolabs/workbydate/index.js',
	// 	output: [
	// 		{
	// 			file: 'econolabs/dist/workbydate.js',
	// 			format: 'iife',
	// 			name: "workbydate"
	// 		}
	// 	],
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 	//	terser({format: { comments: false}})
	// 	]
	// },





	// {
	// 	input: 'src/vanillajs/econolabs/editcurrentquiz/index.js',
	// 	output: [

	// 		{
	// 			file: 'econolabs/dist/editcurrentquiz.js',
	// 			format: 'iife',
	// 			name: "editcurrentquiz"
	// 		}
	// 	],
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 	//	terser({format: { comments: false}})
	// 	]
	// },




	// {
	// 	input: 'src/vanillajs/econolabs/quizcardwithstorage27102024/index.js',
	// 	output: [

	// 		{
	// 			file: 'econolabs/dist/editing.js',
	// 			format: 'iife',
	// 			name: "editing"
	// 		}
	// 	],
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 	//	terser({format: { comments: false}})
	// 	]
	// },





	// {
	// 	input: 'src/vanillajs/econolabs/groupavatars/groupavatars.js',
	// 	output: {
	// 		file: 'econolabs/groupavatars/groupavatars.js',
	// 		format: 'iife',
	// 		name: "groupavatars"
	// 	},
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 		//	terser({format: { comments: false}})
	// 	]
	// },


	// {
	// 	input: 'src/vanillajs/templates/templateworkbookcrud.js',
	// 	output: {
	// 		file: 'templates/dist/templateworkbookcrud.js',
	// 		format: 'iife',
	// 		name: "templateworkbookcrud"
	// 	},
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development'
	// 		}),
	// 		nodeResolve(),
	// 		//		terser({format: { comments: false}})
	// 	]
	// },

	// {
	// 	input: 'src/vanillajs/econolabs/currentgroup/index.js',
	// 	output: {
	// 		file: 'econolabs/currentgroup/currentgroup.js',
	// 		format: 'iife',
	// 		name: "currentgroup"
	// 	},
	// 	plugins: [
	// 		injectProcessEnv({
	// 			NODE_ENV: 'development' // 'development' // 'production'
	// 		}),
	// 		nodeResolve(),
	// 	//	terser({format: { comments: false}})
	// 	]
	// },

];