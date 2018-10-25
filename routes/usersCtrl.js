// Imports
var bcrypt   = require('bcrypt-nodejs');
var jwtUtils = require('../utils/jwt.utils');
var models   = require('../models');

// Routes
module.exports = {
    register: function(req, res) {
        // Params
        var email    = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio      = req.body.bio;

        if(email == null || username == null || password == null) {
            return res.status(400).json({ 'error': 'Missing parameters' });
        }

        models.User.findOne({
            attributes: ['email'],
            where: { email: email}
        }).then(function(userFound) {

            if(!userFound) {
                // Generate salt for the hash
                var salt = bcrypt.genSaltSync(10);

                bcrypt.hash(password, salt, null, function(err, bcryptedPassword) {
                    if (err) {
                        return res.status(500).json({ 'error': 'Error while hashing the password' });
                    }

                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                        bio: bio,
                        isAdmin: 0
                    }).then(function(newUser) {
                        return res.status(201).json({ 'userId': newUser.id });
                    }).catch(function(err) {
                        return res.status(500).json({ 'error': 'Cannot add user' });
                    });
                });
            } else {
                return res.status(409).json({ 'error': 'User already exists' });
            }
        }).catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to verify user' });
        });
    },

    login: function(req, res) {
        // Params
        var email    = req.body.email;
        var password = req.body.password;
        
        if(email == null || password == null) {
            return res.status(400).json({ 'error': 'Missing parameters' });
        }

        models.User.findOne({
            where: { email: email}
        }).then(function(userFound) {

            if (userFound) {
                bcrypt.compare(password, userFound.password, function(err, result) {
                    
                    if(result) {
                        return res.status(200).json( {
                            'userId': userFound.id,
                            'token': jwtUtils.generateTokenForuser(userFound)
                        });
                    } else {
                        return res.status(403).json({ 'error': 'Invalid password' });
                    }
                });
            } else {
                return res.status(404).json({ 'error': 'User does not exists' });
            }

        }).catch(function(err) {
            return res.status(500).json({ 'error': 'Unable to verify user' });
        });
    }
}