import logger from '../src';
import { IsRequiredError } from 'krimzen-ninja-common-errors';
beforeEach(function() {
    logger.reset();
    process.env.NODE_ENV = 'test';
    delete process.env.LEVEL;
});
describe('logger', () => {
    describe('initialise', function() {
        it('should throw an error if no options are provided', function() {
            expect(() => logger.initialise()).toThrow(IsRequiredError);
            expect(() => logger.initialise()).toThrow(/options/);
        });
        it('should throw an error if no name is set on the options object', function() {
            expect(() => logger.initialise({})).toThrow(IsRequiredError);
            expect(() => logger.initialise({})).toThrow(/options\.name/);
        });
        it('should also work for production', function() {
            process.env.NODE_ENV = 'production';
            logger.initialise({ name: 'krimzen-ninja-logging' });
        });
        it('should allow chaining functions', function() {
            logger.initialise({ name: 'krimzen-ninja-logging' }).overrideConsole();
        });
        describe('prettyPrint', function() {
            it('should default prettyPrint to true for non production', function() {
                let opts = { name: 'krimzen-ninja-logging' };
                logger.initialise(opts);
                expect(opts.prettyPrint).toBe(true);
            });
            it('should allow you to set prettyPrint to false for non production', function() {
                let opts = { name: 'krimzen-ninja-logging', prettyPrint: false };
                logger.initialise(opts);
                expect(opts.prettyPrint).toBe(false);
            });
        });
        describe('level', function() {
            it('should default level to "trace" for non production', function() {
                let opts = { name: 'krimzen-ninja-logging' };
                logger.initialise(opts);
                expect(opts.level).toBe('trace');
            });
            it('should allow you to set level to something else for non production', function() {
                let opts = { name: 'krimzen-ninja-logging', level: 'warn' };
                logger.initialise(opts);
                expect(opts.level).toBe('warn');
            });
            it('should allow you to set the level via environment variables for non production', function() {
                let opts = { name: 'krimzen-ninja-logging' };
                process.env.LEVEL = 'fatal';
                logger.initialise(opts);
                expect(opts.level).toBe('fatal');
            });
            it('should allow you to set the level via environment variables for production', function() {
                let opts = { name: 'krimzen-ninja-logging' };
                process.env.LEVEL = 'fatal';
                process.env.NODE_ENV = 'production';
                logger.initialise(opts);
                expect(opts.level).toBe('fatal');
            });
            it('should allow you to override the level set in env by passing it in as an option.', function() {
                let opts = { name: 'krimzen-ninja-logging', level: 'trace' };
                process.env.LEVEL = 'fatal';
                process.env.NODE_ENV = 'production';
                logger.initialise(opts);
                expect(opts.level).toBe('trace');
            });
        });
    });
    describe('overrideConsole', function() {
        it('should throw an error if not initialised ', function() {
            expect(() => logger.overrideConsole()).toThrow('You must call initialise before calling');
        });
        Object.keys(logger.consoleMap).forEach(function(consoleMethod) {
            it('should not throw an error for ' + consoleMethod, () => {
                logger.initialise({ name: 'krimzen-ninja-logging' });
                logger.overrideConsole();
                console[consoleMethod]('test-' + consoleMethod);
            });
        });
        it('should not allow you to log certain properties like a password', function() {
            logger.initialise({ name: 'krimzen-ninja-logging' });
            logger.overrideConsole();
            console.log({ password: 'test' });
        });
    });
    describe('child', function() {
        it('should work when using the ref returned from initialise', function() {
            const pino = logger.initialise({ name: 'krimzen-ninja-logging' });
            const child = pino.child({ a: 'property' });
            child.info('hello child from initialise method!');
        });
        it('should work when using the ref returned from overrideConsole', function() {
            logger.initialise({ name: 'krimzen-ninja-logging' });
            const pino = logger.overrideConsole();
            const child = pino.child({ a: 'property' });
            child.info('hello child from override method!');
        });
        it('should work when calling the child method', function() {
            logger.initialise({ name: 'krimzen-ninja-logging' });
            const child = logger.child({ a: 'property' });
            child.info('hello child from child method!');
        });
    });
    describe('pino', function() {
        it('should export the raw pino object', function() {
            logger.initialise({ name: 'krimzen-ninja-logging' });
            logger.pino().info({ obj: 42 }, 'hello world');
        });
    });
});
