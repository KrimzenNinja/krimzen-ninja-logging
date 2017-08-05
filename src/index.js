//const debug = require('debug')('krimzen-ninja-logging');
const createPino = require('pino');
let pino;

const consoleMap = {
    fatal: 'fatal',
    error: 'error',
    warn: 'warn',
    log: 'info',
    info: 'info',
    debug: 'debug',
    trace: 'trace'
};

const defaultDevOptions = {
    prettyPrint: true,
    level: 'trace'
};
const defaultProductionOptions = {};
function initialise(opts) {
    if (!opts) {
        if (process.env.NODE_ENV === 'production') {
            opts = defaultProductionOptions;
        } else {
            opts = defaultDevOptions;
        }
    }
    pino = createPino(opts);
    return pino;
}

function overrideConsole() {
    ensureInitialised();
    Object.keys(consoleMap).forEach(function(consoleMethod) {
        const pinoMethod = consoleMap[consoleMethod];
        console[consoleMethod] = function() {
            pino[pinoMethod].apply(pino, formatArgs(arguments));
        };
    });
    return pino;
}

function ensureInitialised() {
    if (!pino) {
        initialise();
    }
}

function formatArgs(args) {
    //todo
    //let argumentArray = Array.prototype.slice.call(args);
    //argumentArray = argumentArray.map(mapArg);
    return args;
}

function child() {
    ensureInitialised();
    return pino.child.apply(pino, formatArgs(arguments));
}

export default {
    initialise,
    consoleMap,
    overrideConsole,
    child
};
