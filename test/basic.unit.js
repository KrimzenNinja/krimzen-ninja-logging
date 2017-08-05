import logger from '../src';

describe('logger', () => {
    describe('overrideConsole', function() {
        logger.overrideConsole();
        Object.keys(logger.consoleMap).forEach(function(consoleMethod) {
            it('should not throw an error for ' + consoleMethod, () => {
                console[consoleMethod]('test-' + consoleMethod);
            });
        });
    });
    describe('child', function() {
        it('should work when using the ref returned from initialise', function() {
            const pino = logger.initialise();
            const child = pino.child({ a: 'property' });
            child.info('hello child from initialise method!');
        });
        it('should work when using the ref returned from overrideConsole', function() {
            const pino = logger.overrideConsole();
            const child = pino.child({ a: 'property' });
            child.info('hello child from override method!');
        });
        it('should work when calling the child method', function() {
            const child = logger.child({ a: 'property' });
            child.info('hello child from child method!');
        });
    });
});
