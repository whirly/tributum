/**
 * Created with JetBrains WebStorm.
 * User: whirl_000
 * Date: 25/10/13
 * Time: 22:39
 * To change this template use File | Settings | File Templates.
 */

var fs = require("fs");
var csv = require("csv");
var async = require("async");

cus = {

    cities: [ "STRASBOURG", "SCHILTIGHEIM", "ILLKIRCH GRAF.", "BISCHHEIM", "LINGOLSHEIM", "OSTWALD",
        "HOENHEIM", "GEISPOLSHEIM", "SOUFFELWEYERSHEIM", "ECKBOLSHEIM", "VENDENHEIM", "WANTZENAU (LA)",
        "MUNDOLSHEIM", "REICHSTETT", "FEGERSHEIM", "OBERHAUSBERGEN", "ESCHAU", "WOLFISHEIM", "PLOBSHEIM"
    ],

    cityData: {},

    directory: "",

    getIndexForCity: function( city ) {
        if (city) {
            var index;

            for(index in this.cities) {
                if(city == this.cities[ index ]) {
                    return index;
                }
            }
        }

        return -1;
    },

    process: function( file, callback ) {
        var year = file.replace( ".csv", "" );
        cus.cityData[ year ] = new Array();

        csv()
            .from.path( cus.directory + "/" + file, { delimiter: ";" })
            .on( 'record', function( row, index ) {
                var cityIndex = cus.getIndexForCity( row[ 1 ] );

                if( cityIndex >= 0 ) {
                    cus.cityData[ year ].push({
                        name: row[ 1 ],
                        population: parseInt( row[ 2 ].replace(" ", "" ) ),
                        spendingPerInhabitant: parseInt( row[ 5 ].replace(" ", "" ) ),
                        directTaxesPerInhabitant: parseInt( row[ 6 ].replace(" ", "" ) ),
                        realIncomePerInhabitant: parseInt( row[ 7 ].replace(" ", "" ) ),
                        equipmentSpendingPerInhabitant: parseInt( row[ 8 ].replace(" ", "" )),
                        debtPerInhabitant: parseInt( row[ 9 ].replace(" ", "" )),
                        operatingCost: parseInt( row[ 10 ].replace(" ", "" ))
                    });
                }
            })
            .on( 'end', function( count ) {
                callback( null, cus.cityData[ year ] )
            })
            .on( 'error', function( err ) {
                console.log( err );

            });
    },

    parse: function( directory, callback ) {

        cus.directory = directory;

        fs.readdir( directory, function( err, files ) {
            if( err ) {
                callback( err, undefined );
            } else {
                var index;
                var fileToProcess = files.length;

                async.map( files, cus.process, function( results) {
                    callback( null, cus.cityData )
                })
                for( index in files ) {
                    file = files[ index ];

                }
            }
        });
    },

    getEntryForCityForYear: function( year, city ) {
        var entriesForYear = cus.cityData[ year ];

        var index, entry;


        for( index in entriesForYear ) {
            entry = entriesForYear[ index ];

            if( entry.name == city ) {
                return entry;
            }
        }

        return null;
    },

    getDataFor: function( city, category ) {

        var resultat = [];
        var index;

        for (index in cus.cityData) {
            var entry = this.getEntryForCityForYear( index, city );

            if( entry ) {
                line = {
                    'year': index
                }

                var amount = entry[ category ];

                if( category != "population" ) {
                    if( parseInt( index ) < 2002 ) {
                        amount = parseInt( amount ) / 6.55957;
                    }
                }
                line[ category ] = amount;
                resultat.push( line );
            }

        }

        return resultat;
    }
}


module.exports = {
    Cus: cus
}