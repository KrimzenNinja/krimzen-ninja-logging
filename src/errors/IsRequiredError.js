require('util').inherits(IsRequiredError, Error);

export default function IsRequiredError(requiredValue, functionName) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = 'ERR_KN_IS_REQUIRED';
    if (functionName) {
        this.message = `You must provide "${requiredValue}" to the "${functionName}" function`;
    } else {
        this.message = `The "${requiredValue}" value is required`;
    }
}
