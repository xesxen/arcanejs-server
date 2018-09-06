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
    }


    login(username, password, token) {
        return new Promise((resolve, reject) => {
            this.ldapClient.bind(ldapEscape.dn`uid=${username},` + this.config.ldapAuth.bindDN, password, (err) => {
                if (err) {
                    debug(err);
                    debug(username);
                    reject(new Error(err)); 
                }
                return resolve(username);
            });
        });
    }
    
}


module.exports = LdapAuth;
