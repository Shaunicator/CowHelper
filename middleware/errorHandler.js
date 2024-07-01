import { logEvents } from './logEvents.js';

export const errorHandler = (error, request, response, next) => {
    logEvents(`${error.name}: ${error.message}`, 'errorLog.txt');
    console.error(error.stack);
    response.status(500).send(error.message);
}
