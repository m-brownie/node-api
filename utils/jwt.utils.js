// Imports
var jwt    = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'BB93C266FC35279ACA0DD7B3EDEA246D93';

// Exported functions
module.exports = {
    generateTokenForuser: function(userData) {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        }, 
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        });
    }
}