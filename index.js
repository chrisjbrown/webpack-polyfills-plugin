var ConcatSource = require("webpack-core/lib/ConcatSource");
var PolyfillService = require('polyfill-service');
var fs = require("fs");

module.exports = function PolyfillsPlugin(options) {

	options = options || {};
    options = {
		uaString: 'Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)',
    	minify: true
    };

    return { apply: function (compiler) {

		PolyfillService.getPolyfillString(this.options).then(function(bundleString) {
			compiler.plugin("compilation", function(compilation) {
		        compilation.plugin("optimize-chunk-assets", function(chunks, callback) {
		            chunks.forEach(function(chunk) {
		                if(!chunk.initial) return;
		                chunk.files.forEach(function(file, i) {
		                    compilation.assets[file] = new ConcatSource("/* Polyfills */\n", bundleString, compilation.assets[file]);
		                });
		            });
		            callback();
		        });
		    });
		});
    } };
};
