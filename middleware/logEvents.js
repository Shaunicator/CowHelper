import {format} from 'date-fns'

//const { format } = require('date-fns');
import { v4 as uuidv4 } from 'uuid';
//const { v4: uuid } = require('uuid');

import fs from 'fs'; 
// const fs = require('fs');
import fsPromises from 'fs'
// const fsPromises = require('fs').promises;
import path from 'path';
// const path = require('path');
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'dd-mm-yyy\tHH:mm:ss.ms')}`;
    const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..','logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..','logs'));
        }

        await fsPromises.appendFile(path.join(__dirname,'..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

export const logger = (request, response, next) => {
    logEvents(`[${request.method}]\t${request.headers.origin}\t${request.url}`, 'requestLog.txt')
    console.log(`[${request.method}] ${request.path}`);
    next();
}
