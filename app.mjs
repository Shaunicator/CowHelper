//const assert = require('assert');
console.clear;
console.log("[START]:\t Starting app.mjs script...")

import express from 'express'
const app = express();

import * as path from 'path'
import cors from 'cors'
import { corsOptions } from './config/corsOptions.js';
import { logger } from './middleware/logEvents.js';
import { errorHandler } from './middleware/errorHandler.js';
import { error } from 'console';

//https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // get the name of the directory

const PORT = process.env.PORT || 3000;

// custom middleware logging
//app.use(logger);
//Cross Origin Resource Sharing
app.use(cors(corsOptions));
//Express 4+ middleware
app.use(express.urlencoded({ extended: false })); //url encocded for form data
app.use(express.json()); //use for getting the json data from a response

//serve static files. public being a specific folders ie css etc
app.use('/',express.static('./public'))

// routes
import { root } from './routes/root.js';
import { unitData } from './routes/api/unitData.js'
app.use('/', root);
app.use('/unit-info', root);
app.use('/getUnitData', unitData)


//Express accepts regex
//^=Starts with, $=ends "start with", | = or
//(xxx)? makes optional

//Moves these to a router in routes/root.js as per subdir.js
app.get('^/$|/index(.html)?', (request, response) => {
    response.sendFile('./index.html');
    //response.sendFile('./index.html', { root: '.'});
    //response.sendFile(path.join(__dirname, 'index.html'));
})
//example for re-directs
app.get('/old-page(.html)?', (request, response) => {
    //302 by default (not permanent redirect)
    response.redirect(301, '/new-page.html');
})

app.all('/*', (request, response) => {
    response.status(404);
    if (request.accepts('html')){
        response.sendFile('./views/404.html')
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