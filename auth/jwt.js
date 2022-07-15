const jwt = require('jsonwebtoken')
require('dotenv').config()

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// // // AUTHENTICATION 
const authentication = async(token) => {
    try {
        return await jwt.sign({
                data: token
              }, process.env.SECRET_KEY, { expiresIn: '24h' });
    } catch (error) {
        return error
    }
};


// // // AUTHORIZE TOKEN FROM DATABASE
const authorizeUser = async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const userData = await prisma.user.findUnique({
            where: { id }
        })
        if(!(userData)){
            return res.status(400).json({ msg: "Please register first." })
        }
        if(!(userData.token)){
            return res.status(400).json({ msg: 'Please log in first.' })
        }
        req.body.id = id;
        req.body.token = userData.token;
    } catch (error) {
        return res.status(400).json({ msg: "Something failed.", Error: error })
    }
    next();
};


const authorizeSeller = async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const sellerData = await prisma.seller.findUnique({
            where: { id }
        })
        if(!(sellerData)){
            return res.status(400).json({ msg: "Please register first." })
        }
        if(!(sellerData.token)){
            return res.status(400).json({ msg: 'Please log in first.' })
        }
        req.body.id = id;
        req.body.token = sellerData.token;
        next();
    } catch (error) {
        return res.status(400).json({ msg: 'Something failed.', Error: error })
    }
};

module.exports = {
    authentication,
    authorizeUser,
    authorizeSeller
}

