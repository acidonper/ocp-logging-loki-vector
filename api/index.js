const express = require( "express" );
var bodyParser = require('body-parser')

const app = express();
const port = 8888; // default port to listen

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// define a route handler for the default home page - POST
app.post( "/", jsonParser, function ( req, res ) {
    console.log(req.headers)
    console.log(req.body)
    res.send( "POST received" );
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );