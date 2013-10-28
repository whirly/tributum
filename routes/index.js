
/*
 * GET home page.
 */

exports.index = function(req, res){

    // this is ugly, but firefox made me do it.
    console.log( req.headers['user-agent'] );
    if( req.headers['user-agent'].indexOf("Firefox") !== -1 ) {
        res.render('index', { chartWidth: '1170px' } );
    } else {
        res.render('index', { chartWidth: '100%' } );
    }


};