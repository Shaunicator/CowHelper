
import express from 'express';
//const express = require('express');
const router = express.Router();
//const router = express.Router();
import * as path from 'path'
//const path = require('path');
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // get the name of the directory

router.get('^/$|index(.html)?', (request, response) => {
    response.sendFile('../index.html');
});
router.get('^/$|unit-info(.html)?', (request, response) => {
    response.sendFile ('../unit-info.html');
});

export { router as root }