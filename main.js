import express from 'express'
import { root } from './routes/root.mjs';
import { unitData } from './routes/api/unitData.mjs'

console.clear;
console.log("[START]:\t Starting app.mjs script...")
const PORT = process.env.PORT || 3000;

const app = express();

//Express 4+ middleware
app.use(express.urlencoded({ extended: false })); //url encocded for form data
app.use(express.json()); //use for getting the json data from a response

app.use('/',express.static('./public'))

app.use('/', root);
app.use('/unit-info', root);
app.use('/getUnitData', unitData)

//Always at the end of server script
app.listen(PORT, () =>
    console.log(`---------------------------------------------------------------
[* START *]:\tExpress server started, listening on port ${PORT}
---------------------------------------------------------------\n`));