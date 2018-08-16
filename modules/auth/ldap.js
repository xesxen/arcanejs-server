const storage = require('node-persist');
const LdapAuth = require('ldapauth-fork');



class FileAuth {
    constructor(twoFactorEnabled) {
        this.config = storage.getItem('auth');
        this.twoFactorEnabled = twoFactorEnabled;

        this.ldap = new LdapAuth(this.config.ldapAuth);
    }


    // TODO: Geen idee of dit werkt
    // TODO: 2FA en ldap? Hoe?
    login(username, password, token) {
        return new Promise((resolve, reject) => {
            this.ldap.authenticate(username, password, (err, user) => {
                if (err) {
                    throw new Error(err); 
                }
                return resolve(user);
            });
        });
    }
    
}


module.exports = FileAuth;
