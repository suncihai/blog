define(function( require, exports ){
	exports.onRun = function( data, view ) {
		var container = view.getContainer({
			'container': data.module
		});

		require.async('@pages/archives', function( mod ) {
			mod[data.module](data.module);
		});
	} 
});