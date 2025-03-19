const {EventEmitter} = require('events');
const winston = require('../config/logger');

class AuthEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.on('tokenError', this.logTokenError.bind(this));
        this.on('tokenExpired', this.logTokenExpired.bind(this));
    }

    logTokenError(data) {
        winston.error(`[Token Error] ${data.message} - IP: ${data.ip}`);
    }

    logTokenExpired(data) {
        winston.warn(`[Token Expired] ${data.message} - IP: ${data.ip}`);
    }
}

const authEventEmitter = new AuthEventEmitter();
module.exports = { authEventEmitter };