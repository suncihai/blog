define(function(require, exports) {
	var app = require('app');
	var util = require('util');

	exports.onRun = function(data, view) {

		var blankDom = view.createBlank();

		var Wellcome = app.Container.extend({
			init: function(config, parent) {
				this.$config = {
					'class': 'test-class'
				};
				Object.getPrototypeOf(this).init();
			},
			afterBuild: function() {
				var elem = this.getDOM();
				console.log(elem)
				elm.html('I am new here');
			}
		});

		app.core.create('blank', Wellcome, {
			'target': blankDom
		});
	}
});