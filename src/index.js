const createPino = require('pino');
import { IsRequiredError } from 'krimzen-ninja-common-errors';
let _pino;

const consoleMap = {
    fatal: 'fatal',
    error: 'error',
    warn: 'warn',
    log: 'info',
    info: 'info',
    debug: 'debug',
    trace: 'trace'
};

const logger = {
    initialise,
    consoleMap,
    overrideConsole,
    child,
    pino,
    reset
};

function initialise(opts) {
    if (!opts) {
        throw new IsRequiredError('options', initialise.name);
    }
    if (!opts.name) {
        throw new IsRequiredError('options.name', initialise.name);
    }
    if (process.env.NODE_ENV !== 'production') {
        if (opts.prettyPrint === undefined) {
            opts.prettyPrint = true;
        }
        if (opts.level === undefined) {
            opts.level = process.env.LEVEL || 'trace';
        }
    } else {
        if (opts.level === undefined) {
            opts.level = process.env.LEVEL || 'info';
        }
    }
    _pino = createPino(opts);
    return logger;
}

function overrideConsole() {
    ensureInitialised('overrideConsole');
    Object.keys(consoleMap).forEach(function(consoleMethod) {
        const pinoMethod = consoleMap[consoleMethod];
        console[consoleMethod] = function() {
            _pino[pinoMethod].apply(_pino, arguments);
        };
    });
    return logger;
}

function ensureInitialised(methodName) {
    if (!_pino) {
        throw new Error('You must call initialise before calling ' + methodName);
    }
}

function child() {
    ensureInitialised('child');
    return _pino.child.apply(_pino, arguments);
}

function pino() {
    ensureInitialised('pino');
    return _pino;
}

function reset() {
    _pino = undefined;
    return logger;
}

export default logger;
