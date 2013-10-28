app.controller( 'MainCtrl', [ '$scope', '$http', function( $scope, $http ) {

    $scope.selectedCities = "STRASBOURG";

    $http( { method: 'GET', url: '/api/cities' }).
        success( function( data, status ) {
            $scope.cities = data;
        })

    $scope.changeCity = function( side, city ) {
        $scope.selectedCities = city;
        processCityChange();

    }

    function getDataForCity( city, category, callback ) {
        $http( { method: 'GET', url: '/api/' + city + "/" + category } )
            .success( function( data, status ) {
                callback( data );
        })
    }

    function doGraph( element, value, data ) {

        var gap = 4;
        var padding = 20;
        var leftPadding = 50;

        var svg = d3.select( element );
        var width = $( element ).width();
        var height = $( element ).height();

        var barLabel = function( d ) { return d['year'] };
        var barValue = function( d ) { return d[ value ] };

        var xScale = d3.scale.ordinal().domain( data.map( barLabel )).rangeBands( [leftPadding, width - padding ]);
        var yScale = d3.scale.linear().domain( [ d3.min( data, barValue ) * 0.8, d3.max( data, barValue )]).range([ height - padding, padding ]);

        var xAxis = d3.svg.axis().scale(xScale);
        var yAxis = d3.svg.axis().scale(yScale).orient("left");

        var x = function( d, i ) { return xScale( d.year ) + gap; };
        var y = function( d ) { return yScale(d[ value ]); };

        svg.selectAll(".axis").remove();

        var xAxisGroup = svg.append("g").attr("class", "axis")
            .attr("transform", "translate( 0, " + ( height - padding ) + ")")
            .style( { 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px' })
            .call( xAxis );

        var yAxisGroup = svg.append("g").attr("class", "axis")
            .attr("transform", "translate( " + ( leftPadding ) + ", 0)")
            .style( { 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px' })
            .call( yAxis );

        svg.selectAll(".entry").data([]).
            exit().remove();

        svg.selectAll(".entry").data( data ).
            enter().append("rect")
            .attr("class", "entry" )
            .attr("x", x )
            .attr("y", height - padding )
            .attr('stroke', 'black')
            .attr('fill', 'steelblue')
            .attr('width', xScale.rangeBand() - gap )
            .attr('height', 0 )
            .transition()
            .duration( 1000 )
            .delay(function(d, i) { return i * 100; })
            .attr("y", y )
            .attr("height", function( d ) { return height - padding - yScale( barValue(d) ); } );
    }

    function processCityChange() {
        if( $scope.selectedCities != "" ) {

            getDataForCity( $scope.selectedCities, "population", function( data ) {
                doGraph( "#populationChart", "population", data );
            } );

            getDataForCity( $scope.selectedCities, "spendingPerInhabitant", function( data ) {
                doGraph( "#fonctionnementChart", "spendingPerInhabitant", data );
            } );

            getDataForCity( $scope.selectedCities, "directTaxesPerInhabitant", function( data ) {
                doGraph( "#impotDirectChart", "directTaxesPerInhabitant", data );
            } );

            getDataForCity( $scope.selectedCities, "realIncomePerInhabitant", function( data ) {
                doGraph( "#recetteReelleChart", "realIncomePerInhabitant", data );
            } );

            getDataForCity( $scope.selectedCities, "equipmentSpendingPerInhabitant", function( data ) {
                doGraph( "#equipementChart", "equipmentSpendingPerInhabitant", data );
            } );

            getDataForCity( $scope.selectedCities, "debtPerInhabitant", function( data ) {
                doGraph( "#detteChart", "debtPerInhabitant", data );
            } );

            getDataForCity( $scope.selectedCities, "operatingCost", function( data ) {
                doGraph( "#dotattionChart", "operatingCost", data );
            } );
        }
    }

    // Init
    processCityChange();
}]);