//const assert = require('assert');
console.clear();
console.log("[START]:\t Starting app.js script...")
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./src/config/corsOptions')
const { logger } = require('./src/middleware/logEvents')
const errorHandler = require('./src/middleware/errorHandler');
const { error } = require('console');

const PORT = process.env.PORT || 3000;

// custom middleware logging
app.use(logger);
//Cross Origin Resource Sharing
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false })); //url encocded for form data
app.use(express.json()); //use for getting the json data from a response

//serve static files. public being a specific folders ie css etc
app.use('/',express.static(path.join(__dirname, '/public')))

// routes
app.use('/', require('./src/routes/routes.pages'));
app.use('/getUnitData', require('./src/routes/api/api.getUnitData'))


//Express accepts regex
//^=Starts with, $=ends "start with", | = or
//(xxx)? makes optional

//example for re-directs
app.get('/old-page(.html)?', (request, response) => {
    //302 by default (not permanent redirect)
    response.redirect(301, '/new-page.html');
})

app.all('/*', (request, response) => {
    response.status(404);
    if (request.accepts('html')){
        response.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if (request.accepts('json')){
        response.json({error: "404 Not found"});
    }else{
        response.type('txt').send('404 not found');
    }
})

app.use(errorHandler);

//Always at the end of server script
app.listen(PORT, () =>
    console.log(`---------------------------------------------------------------
[* START *]:\tExpress server started, listening on port ${PORT}
---------------------------------------------------------------\n`));