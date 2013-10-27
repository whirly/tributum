var cus = require("../models/cus").Cus;

exports.listCities = function(req, res) {
        res.json( cus.cities );
    }

exports.getDataForCity=  function(req, res, next ) {
        res.json( cus.getDataFor( req.params.city, req.params.category ));
    }
