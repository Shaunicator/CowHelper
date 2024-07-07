//import { root } from './routes/root.js';
//import { unitData } from './routes/api/unitData.js'
import express from 'express'
import fs from 'node:fs/promises';
// import cors from 'cors'
// import { corsOptionspkg } from './config/corsOptions.js';
// import corsOptionspkg from './config/corsOptions.js';
// const { corsOptions } = corsOptionspkg;

import rootApi from './routes/root.mjs';
const { root } = rootApi;
import unitDataApi from './routes/api/unitData.js';

const { unitData } = unitDataApi;


console.clear;
console.log("[START]:\t Starting app.mjs script...")

const app = express();

const PORT = process.env.PORT || 3000;



// custom middleware logging
//app.use(logger);
//Cross Origin Resource Sharing
/* app.use(cors(corsOptionspkg)); */
//Express 4+ middleware
app.use(express.urlencoded({ extended: false })); //url encocded for form data
app.use(express.json()); //use for getting the json data from a response

//serve static files. public being a specific folders ie css etc
app.use('/',express.static('./public'))

// routes

app.use('/', root);
app.use('/unit-info', root);
app.use('/getUnitData', unitData)


//Express accepts regex
//^=Starts with, $=ends "start with", | = or
//(xxx)? makes optional

       
//example for re-directs
/* app.get('/old-page(.html)?', (request, response) => {
    //302 by default (not permanent redirect)
    response.redirect(301, '/new-page.html');
}) */

/* app.all('/*', (request, response) => {
    response.status(404);
    if (request.accepts('html')){
        response.sendFile('./views/404.html')
    }
    else if (request.accepts('json')){
        response.json({error: "404 Not found"});
    }else{
        response.type('txt').send('404 not found');
    }
}) */

//Always at the end of server script
app.listen(PORT, () =>
    console.log(`---------------------------------------------------------------
[* START *]:\tExpress server started, listening on port ${PORT}
---------------------------------------------------------------\n`));