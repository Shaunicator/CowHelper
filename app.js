//const assert = require('assert');
const path = require('path');
const http = require('http');
const fileSystem = require('fs');
const UnitData = require('./data/unitdata');

//console.log(UnitData.Unit.Infantry[1].Cost.Research.Time);

const PORT = process.env.PORT || 3000;
const style = fileSystem.readFileSync(`./style.css`);
const domJS = fileSystem.readFileSync(`./utility/dom.js`);
const buildInfoIndustry = fileSystem.readFileSync(`./images/buildInfo-Industry.png`);
const buildInfolocalIndustry = fileSystem.readFileSync(`./images/buildInfo-localIndustry.png`);
const homePage = fileSystem.readFileSync(`./index.html`);

const server = http.createServer((req, res) => {
    const url = req.url;
    console.log(url);
    if (url === '/') {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write(homePage);
        res.end();
    }else if(url === '/utility/dom.js'){
        res.writeHead(200, { 'content-type': 'text/javascript' });
        res.write(domJS);
        res.end();
    }else if (url === '/style.css'){
        res.writeHead(200, { 'content-type': 'text/css' });
        res.write(style);
        res.end();
    }else if(url === '/images/buildInfo-Industry.png'){
        res.writeHead(200, { 'content-type': 'image/png' });
        res.write(buildInfoIndustry);
        res.end();
    }else if(url === '/images/buildInfo-localIndustry.png'){
        res.writeHead(200, { 'content-type': 'image/png' });
        res.write(buildInfolocalIndustry);
        res.end();
}}
).listen(PORT, function () {
    console.log(`Server started, running on port ${PORT}`)
});