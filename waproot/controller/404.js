define(function(require, exports) {
	exports.onRun = function(data, view) {

		data.dom = view.createBlank();

		require.async('@pages/404', function(mod) {
			mod.init(data);
		});
	}
});