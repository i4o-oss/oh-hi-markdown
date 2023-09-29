/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
	browserNodeBuiltinsPolyfill: { modules: { punycode: true } },
	ignoredRouteFiles: ['**/.*'],
	// appDirectory: "app",
	// assetsBuildDirectory: "public/build",
	// publicPath: "/build/",
	postcss: true,
	serverModuleFormat: 'cjs',
	serverDependenciesToBundle: [/.*/],
	tailwind: true,
	watchPaths: ['../../packages/oh-hi-markdown/'],
}
