define(function(require, exports) {
	var app = require('app');

	exports.onRun = function(data, view) {

		var blankDom = view.createBlank();

		var bottom = app.Container.extend({
			init: function(config) {
				config = app.cover(config, {
					'class': 'wraperBottom',
					'tag': 'p'
				});
				this.Super('init', arguments);
			},
			domReady: function() {
				var elm = this.getDOM();
				elm.html([
					'<span class="ml2">I am wraperBottom</span>',
					'<button class="ml1 wraperBottomBtn">destroy self</button>'
				].join(''));

				this.bind(elm.find('.wraperBottomBtn'), 'click', 'eventBtn');
			},
			onCast: function(msg) {
				console.log('onCast', msg);
			},
			onBottomFire: function(msg) {
				console.log('received in bottom', msg);
			},
			onWraperBroadcast: function(msg) {
				console.log('received in bottom', msg.param);
			},
			eventBtn: function() {
				this.destroy();
			}
		});

		var inner = app.Container.extend({
			init: function(config) {
				config = app.cover(config, {
					'class': 'wraperInner',
					'tag': 'p'
				});
				this.Super('init', arguments);
			},
			domReady: function() {
				var elm = this.getDOM();
				elm.html([
					'<span class="ml1">I am wraperInner</span>',
					'<button class="ml1 wraperInnerBtn">destroy child</button>'
				].join(''));

				var bt = this.create('wraperBottom', bottom, {
					'target': elm
				});

				this.bind(elm.find('.wraperInnerBtn'), 'click', 'eventBtn');
			},
			onBottomFire: function(msg) {
				console.log('received in inner', msg);
				// msg.returns = 'return at inner';
				// return false;
			},
			onCast: function(msg) {
				console.log('onCast', msg);
			},
			onWraperBroadcast: function(msg) {
				console.log('received in inner', msg.param);
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
				config = app.cover(config, {
					'class': 'wraper',
					'template': 'project/template/wraper.html',
					'vModel': {
						'message': 'I am Vue.js'
					}
				});
				this.Super('init', arguments);
			},
			viewReady: function() {
				var elm = this.getDOM();
			}
		});

		var bd = app.core.create('wraper', wraper, {
			'target': blankDom
		});

	}
});