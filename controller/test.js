define(function(require, exports) {
	var app = require('app');
	var util = require('util');

	exports.onRun = function(data, view) {

		var blankDom = view.createBlank();

		var inner = app.Container.extend({
			init: function(config) {
				config = app.merge(config, {
					'class': 'wraperInner',
					'tag': 'p'
				});
				this.Super('init', arguments);
			},
			domReady: function() {
				var elm = this.getDOM();
				elm.html('i am wraperInner');
			}
		});

		var wraper = app.Container.extend({
			init: function(config) {
				config = app.merge(config, {
					'class': 'wraper'
				});
				this.Super('init', arguments);
			},
			domReady: function() {
				var elm = this.getDOM();
				elm.html('I am wraper');

				this.create('wraperInner', inner, {
					'target': elm
				});
			}
		});

		var bd = app.core.create('wraper', wraper, {
			'target': wraper
		});
	}
});