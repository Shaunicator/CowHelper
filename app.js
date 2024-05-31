//const assert = require('assert');
const path = require('path');
const http = require('http');
const fileSystem = require('fs');

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
    const url = req.url;
    res.end("Welcome")
}
).listen(PORT, function(){
    console.log(`Server started, running on port ${PORT}`)});