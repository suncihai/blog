define(function(require, exports) {
	var app = require('app');
	var util = require('util');

	exports.onRun = function(data, view) {

		var ev1, ev2, ev3;

		var blankDom = view.createBlank();

		var bottom = app.Container.extend({
			init: function(config) {
				config = app.merge(config, {
					'class': 'wraperBottom',
					'tag': 'p'
				});
				this.Super('init', arguments);
			},
			afterBuild: function() {
				var elm = this.getDOM();
				elm.html([
					'<span class="ml2">I am wraperBottom</span>',
					'<button class="ml1 wraperBottomBtn">destroy self</button>'
				].join(''));

				this.event.bind(elm.find('.wraperBottomBtn'), 'click', 'eventBtn');
			},
			eventBtn: function() {
				this.destroy();
			}
		});

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
				elm.html([
					'<span class="ml1">I am wraperInner</span>',
					'<button class="ml1 wraperInnerBtn">destroy child</button>'
				].join(''));

				var bt = this.create('wraperBottom', bottom, {
					'target': elm
				});

				this.event.bind(elm.find('.wraperInnerBtn'), 'click', 'eventBtn');
			},
			eventBtn: function() {
				var chs = this.getChild('wraperBottom');
				if (chs) {
					chs.destroy();
				}
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
				elm.html([
					'I am wraper',
					'<button class="ml1 wraperBtn">destroy all child</button>'
				].join(''));

				var inn = this.create('wraperInner', inner, {
					'target': elm
				});

				this.event.bind(elm.find('.wraperBtn'), 'click', this.eventBtn);
			},
			eventBtn: function(evt, elm) {
				this.destroy();
			}
		});

		var bd = app.core.create('wraper', wraper, {
			'target': blankDom
		});
	}
});