console.log("Loading Module: Events")

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// Simulate a game loop with a timer
setInterval(() => {
    eventEmitter.emit('globalTick');
    }, 1000);  // Emit a "tick" event every second

exports.events = eventEmitter;