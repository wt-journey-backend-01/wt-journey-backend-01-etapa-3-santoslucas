function formatError(message, errors) {
    return {
        status: 400,
        message: message,
        errors: errors.reduce((acc, err) => {
            const key = Object.keys(err)[0];
            acc[key] = err[key];
            return acc;
        }, {})
    };
}

module.exports = {
    formatError
};
