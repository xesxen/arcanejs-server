'use strict';

/**
 * Loads the authentication module.
 * config.authmodule must be a string that resembles the filename of an installed authentication module in this file's directory 
 */
module.exports = (config) => {
    if (!config.authModule) {
        throw new Error('Authentication module not provided.');
    }

    let authmodule;
    try {
        authmodule = require(`./${config.authModule}`);
    } catch (err) {
        console.log(err);
        throw new Error('Error loading authentication module.. Does it exist?');
    }
    return authmodule;
};
