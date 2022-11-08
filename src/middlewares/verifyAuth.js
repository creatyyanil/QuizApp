const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');


module.exports = (req, res, next) => {
    // console.log("token",req.headers);
    const { authorization } = req.headers;


    if (!authorization) {
        return res.status(401).send({ error: "You must be loged in" });
    }


    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'LoginSecretKey', async (err, payload) => {
      if (err) {
        return res.status(401).send({ error: 'You must be logged in.' });
      }
  
      const { userId } = payload;
  
      const user = await User.findById(userId);
      req.user = user;
      next();
    });

};