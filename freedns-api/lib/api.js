'use sttict';

const {validators, parsers, get} = require('./utils');
const crypto = require('crypto');

module.exports = {

    /**
     * Get update urls from freedns API
     * 
     * @param {Object} config
     *                 config.username
     *                 config.password
     *                 
     * @return {Promise}
     */
    getdyndns: async (config) => {
        try {
            validators.getdyndns(config);
            const sha = crypto.createHash('sha1').update(config.username + '|' + config.password).digest('hex');
            const url = `https://freedns.afraid.org/api/?action=getdyndns&v=2&sha=${sha}`;
            const res = await get(url);
            return parsers.getdyndns(res);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update a domain using an update url
     * 
     * @param  {Object} config Configuration object
     *                  config.updateUrl: The update url provided by freedns .
     *                  [config.address]: The ip address that will be associated with the domain.
     *                                    if not provided automatic detection will be used.
     * @return {Promise}
     */
    update: async (config) => {
        try {
            validators.update(config);
            const url = config.address ? `${config.updateUrl}&address=${config.address}` : config.updateUrl;
            const res = await get(url);
            return parsers.update(res);
        } catch (error) {
            throw error;
        }

    }
};