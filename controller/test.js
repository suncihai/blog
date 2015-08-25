define(function(require, exports) {
	var app = require('app');
	var util = require('util');

	exports.onRun = function(data, view) {

		var blankDom = view.createBlank();

		var Wellcome = app.Container.extend({
			init: function(config, parent) {
				config = {
					'class': 'test-class'
				};
				this.Super('init', arguments);
			},
			domReady: function() {
				// var elem = this.getDOM();
				// console.log('subClass domReady trigger!!');
				// elm.html('I am new here');
			}
		});

		app.core.create('blank', Wellcome, {
			'target': blankDom
		});
	}
});