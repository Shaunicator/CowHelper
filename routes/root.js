
import express from 'express';

const router = express.Router();
import * as path from 'path'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // get the name of the directory

router.get('^/$|index(.html)?', (request, response) => {
    //response.sendFile('./index.html',{ root: '/site/wwwroot' });//web deploy
    response.sendFile('./index.html',{ root: '.' });//local
});
router.get('^/$|unit-info(.html)?', (request, response) => {
    //response.sendFile ('./unit-info.html',{ root: '/site/wwwroot' });//web deploy
    response.sendFile ('./unit-info.html',{ root: '.' });//local
});

export { router as root }