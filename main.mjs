import express from 'express'

console.clear;
console.log("[START]:\t Starting app.mjs script...")
const PORT = process.env.PORT || 3000;

const app = express();

app.use('/',express.static('./public'))

//Always at the end of server script
app.listen(PORT, () =>
    console.log(`---------------------------------------------------------------
[* START *]:\tExpress server started, listening on port ${PORT}
---------------------------------------------------------------\n`));