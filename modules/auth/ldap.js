const storage = require('node-persist');
const ldap = require('ldapjs');
const ldapEscape = require('ldap-escape');
const debug = require('debug')('auth:ldap');


class LdapAuth {

    constructor(twoFactorEnabled) {
        this.config = storage.getItem('auth');
        this.twoFactorEnabled = twoFactorEnabled;
        let clientOptions = {
            url: this.config.ldapAuth.url,
            tlsOptions: {
                rejectUnauthorized: false
            }
        };
        this.ldapClient = ldap.createClient(clientOptions);
        this.userCache = {};
    }


    /**
     * Authenticates and loads roles of user from ldap.
     */
    login(username, password, token) {
        return new Promise((resolve, reject) => {
            let bindDN = this.getBaseDN(username);
            this.ldapClient.bind(bindDN, password, (err) => {
                if (err) {
                    debug(err);
                    debug(username);
                    return reject(new Error(err)); 
                }
                return this.loadRoles(bindDN).then((roles) => {
                    this.userCache[username] = {
                        roles: roles
                    };
                    // finally return the username
                    return resolve(username);
                });
            });
        });
    }

    getBaseDN(username) {
        return ldapEscape.dn`uid=${username},` + this.config.ldapAuth.bindDN;
    }


    /**
     * Loads roles of user from ldap
     * Needs an active bind connection to ldap
     */
    loadRoles(baseDN){
        let rolesAttribute = 'memberOf';
        return this.getAttributesFromLdap(baseDN, [rolesAttribute]).then(entries => {
            let roles = [];
            debug('entries:');
            debug(entries);
            for(let entry of entries) {
                debug('entry:');
                if(entry.hasOwnProperty(rolesAttribute)) {
                    debug(entry[rolesAttribute]);
                    roles = roles.concat(entry[rolesAttribute]);
                }
            }
            return roles;
        });
    }


    /**
     * Get information about a user from ldap
     * @property baseDN {string} The base to search from
     * @property attributes {Array} A list of attributes to fetch from ldap
     */
    getAttributesFromLdap(baseDN, attributes) {
        debug(baseDN);
        debug(attributes);
        return new Promise((resolve, reject) => {
            let options = {
                'attributes': attributes
            };
            this.ldapClient.search(baseDN, options, (err, res) => {
                if(err) {
                    debug(err);
                    reject(err);
                }
                let entries = [];
                res.on('searchEntry', function(entry) {
                    debug('entry: ' + JSON.stringify(entry.object));
                    // entry contains attributes from ldap.
                    entries.push(entry.object);
                });
                res.on('searchReference', function(referral) {
                    debug('referral: ' + referral.uris.join());
                });
                res.on('error', function(err) {
                    debug('error: ' + err.message);
                });
                res.on('end', function(result) {
                    debug('ldap status: ' + result.status);
                    resolve(entries);
                });
            });
        });
    }

    /**
     * return a list of roles of an user if present.
     */
    getRoles(username) {
        debug(this.userCache);
        debug(username);
        let roles = this.userCache[username].roles;
        if(roles) {
            debug(`Roles for ${username}: ${roles}`);
            return roles;
        }
        debug(`no roles found for user ${username}`);
        return [];
    }

}

module.exports = LdapAuth;
