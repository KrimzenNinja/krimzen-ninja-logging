//const debug = require('debug')('krimzen-ninja-logging');
const createPino = require('pino');
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

function initialise(opts) {
    if (!opts) {
        throw new Error('You must provide options to the initialise method');
    }
    if (!opts.name) {
        throw new Error('You must provide options.name to the initialise method');
    }
    if (process.env.NODE_ENV !== 'production') {
        if (opts.prettyPrint === undefined) {
            opts.prettyPrint = true;
        }
        if (opts.level === undefined) {
            opts.level = 'trace';
        }
    }
    _pino = createPino(opts);
    return _pino;
}

function overrideConsole() {
    ensureInitialised('overrideConsole');
    Object.keys(consoleMap).forEach(function(consoleMethod) {
        const pinoMethod = consoleMap[consoleMethod];
        console[consoleMethod] = function() {
            _pino[pinoMethod].apply(_pino, arguments);
        };
    });
    return _pino;
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
}

export default {
    initialise,
    consoleMap,
    overrideConsole,
    child,
    pino,
    reset
};
