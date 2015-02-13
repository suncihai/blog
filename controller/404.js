define(function( require, exports ){
	exports.onRun = function( data, view ) {
		data.dom = view.createNotFound();
		require.async('@pages/404', function( module ) {
			module['onMain']( data );
		});
	}
});