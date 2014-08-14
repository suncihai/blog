define(function( require, exports ){
	exports.onRun = function( data, view ) {
		var container = view.getContainer({
			'container': data.name
		});

		require.async('@pages/archives', function( mod ) {
			mod['build']( data );
		});
	} 
});