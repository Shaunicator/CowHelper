//const assert = require('assert');
console.clear();
const http = require('http');
const path = require('path');
const fs = require('fs');
const { text } = require('express');
const fsPromises = require('fs').promises;
const Unit = require('./data/unitdata').Unit;

//console.log(Unit.Infantry[1].Cost.Research.Time);

const PORT = process.env.PORT || 3000;
const FILE_404 = '404.html'
const REDIRECTS = {
    "oldpage": "newpage"
}

const serveFile = async (filePath, contentType, response) => {
    console.log(`[++++]:\t\tServing file: ${path.parse(filePath).base}...`);
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes(FILE_404) ? 404 : 200,
            { 'Content-Type': contentType });
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
        console.log(`[info]:\t\t${path.parse(filePath).base} loaded successfuly. \n`);

    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    const url = req.url;
    console.log(`\n[request]:\tStarting request for URL: ${url}`);

    const fileExt = path.extname(url);
    //console.log(`Current file extension: ${fileExt}`);

    let contentType;
    switch (fileExt) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case 'jpg' || 'jpeg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
            break;
    };

    let filePath =
        contentType === 'text/html' && url == '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && url.slice(-1) === '/'
                ? path.join(__dirname, 'views', url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', url)
                    : path.join(__dirname, url);

    //makes .html ext not required in browser
    if (!fileExt && req.url.slice(-1) !== '/') {
        filePath += '.html';
        console.log("[info]:\t\t+++ Adding .html to file");
    }


    const fileExists = fs.existsSync(filePath);
    

    if (fileExists) {
        console.info(`[info]:\t\tFile ${path.parse(filePath).base} found.`);

        serveFile(filePath, contentType, res);

    } else {
        console.error(`\n[error]:\tFile ${path.parse(filePath).base} not found:`);
        console.log(path.parse(filePath));

        if (path.parse(filePath).ext === '.html') {
            console.log(`[info]:\t\tChecking for page ${path.parse(filePath).name} in redirects...`)
            if ( REDIRECTS.hasOwnProperty(path.parse(filePath).name) ) {
                console.log("[info]:\tAttempting redirect...")
                console.log ("[log]:\tFile Name: " + path.parse(filePath).name);
                res.writeHead(301, { 'Location': REDIRECTS[path.parse(filePath).name]+'.html' });
                res.end();
            } else {
                console.log ("[info]:\t\tPage not found - loading 404") 
                serveFile(path.join(__dirname, 'views', FILE_404), 'text/html', res) }
        }
    }
});

//Always at the end of server script
server.listen(PORT, () =>
    console.log(`-------------------------------------------------------
[* START *]:\tServer started, listening on port ${PORT}
-------------------------------------------------------\n`));