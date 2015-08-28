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
			afterBuild: function() {
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
			afterBuild: function() {
				var elm = this.getDOM();
				elm.html('I am wraper');

				var inn = this.create('wraperInner', inner, {
					'target': elm
				});

				console.log('inner', inn);

				console.log('wraper', this);
			}
		});

		var bd = app.core.create('wraper', wraper, {
			'target': blankDom
		});

		console.log('blankDom', bd);
	}
});