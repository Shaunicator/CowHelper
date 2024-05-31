//const assert = require('assert');
const path = require('path');
const http = require('http');
const fileSystem = require('fs');

const PORT = process.env.PORT || 3000;
const homePage = fileSystem.readFileSync(`./index.html`)

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url === '/') {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write(homePage);
        res.end();
}}
).listen(PORT, function(){
    console.log(`Server started, running on port ${PORT}`)});