const User = require("../models/User");
const bcrypt = require('bcrypt');


const basicAuth = async (req, res, next) => {
    
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Authorization Required' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password ] = credentials.split(':');

    const user = await User.findOne({where: { email: email }});

    if(!user){
        return res.status(401).json({ message: 'Invalid token.' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword){
        return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;

    next();
}

module.exports = basicAuth;