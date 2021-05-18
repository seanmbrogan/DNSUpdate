'use strict';


const Ajv = require('ajv');
const ajv = new Ajv({
    allErrors: true
});
const util = require('util');
const get = require('simple-get');


get.concat[util.promisify.custom] = (url) => {
    return new Promise((resolve, reject) => {
        get.concat(url, (error, res, data) => {
            if (error) {
                return reject(error);
            }
            // TODO: handle res.statusCode here ?
            resolve(data.toString());
        });
    });
};


const parsers = {

    /**
     * Parse ASCII formated update urls
     * 
     * sample request: 
     * http://freedns.afraid.org/api/?action=getdyndns&sha=<username|password>
     *
     * sample response:
     * blah.mooo.com|10.10.10.1|http://freedns.afraid.org/dynamic/update.php?xxxx
     * bloh.mooo.com|85.73.73.102|http://freedns.afraid.org/dynamic/update.php?xxxx
     * bleh.mooo.com|94.65.142.5|http://freedns.afraid.org/dynamic/update.php?xxx
     * 
     * @param  {String} body The response from freedns API
     * @return {Array} The parsed data
     */
    getdyndns: (body) => {
        return body.split('\n').map((row) => {
            row = row.split('|');
            return {
                domain: row[0],
                address: row[1],
                updateUrl: row[2]
            };
        });
    },

    /**
     * Parse update status or throw an error
     *
     * sample request:
     * https://freedns.afraid.org/dynamic/update.php?xxxxxxxxx&address=10.10.10.10
     *
     * sample responses:
     * ERROR: Address 10.10.10.10 has not changed
     * Updated bleh.mooo.com to 85.75.249.86 in 0.346 seconds
     * 
     * 
     * @param  {String} body The response from freedns API
     * @return {String}      The parsed data
     */
    update: (body) => {
        const parsed = body.split(':');

        if (parsed[0] === 'ERROR') {
            throw new Error(parsed[1]);
        }
        return parsed[0];
    }
};


const validators = {
    /**
     * Validate configuration object for .getdyndns method
     * @param  {Object} config
     * @throws {Error} If configuration is invalid
     */
    getdyndns: (config) => {
        const validate = ajv.compile({
            properties: {
                username: {
                    allowEmpty: false
                },
                password: {
                    allowEmpty: false
                }
            },
            required: ['username', 'password']
        });

        validate(config);

        if (validate.errors) {
            throw new Error(ajv.errorsText(validate.errors));
        }
    },

    /**
     * Validate configuration object for .udate method
     * @param  {Object} config
     * @throws {Error} If configuration is invalid
     */
    update: (config) => {
        const validate = ajv.compile({
            properties: {
                updateUrl: {
                    allowEmpty: false,
                    format: 'url'
                },
                address: {
                    allowEmpty: false,
                    oneOf: [{ format: 'ipv4' }, { format: 'ipv6' }]
                }
            },
            required: ['updateUrl']
        });

        validate(config);

        if (validate.errors) {
            throw new Error(ajv.errorsText(validate.errors));
        }
    }
};


module.exports = {
    validators,
    parsers,
    get: util.promisify(get.concat)
};