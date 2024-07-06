import {format} from 'date-fns'
import { v4 as uuidv4 } from 'uuid';

//import fs from 'node:fs/promises'
import fs from 'fs'; 
import fsPromises from 'fs';
import path from 'path';

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
