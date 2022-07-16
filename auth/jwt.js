const jwt = require('jsonwebtoken')
require('dotenv').config()

const { PrismaClient } = require('@prisma/client');
const { secretKey } = require('./config');
const prisma = new PrismaClient();


// // // AUTHENTICATION 
const authentication = async(token) => {
    try {
        return await jwt.sign(token, secretKey);
    } catch (error) {
        return error
    }
};


// // // AUTHORIZE TOKEN FROM DATABASE
const authorize = async(req, res, next) => {
    try {
        if(!req.headers.cookie){
            return res.status(404).json({ msg: "Please log in first." })
        }
        const token = req.headers.cookie.split('=')[1];
        const decrypted = jwt.verify(token, secretKey)
        const id = parseInt(decrypted.id);
        const { role } = decrypted;
        let userData;
        if(role === 'USER') {
            userData = await prisma.user.findUnique({
               where: { id }
           })
        }
        if(role === 'SELLER') {
            userData = await prisma.seller.findUnique({
                where: { id }
            })
        }
        if(!(userData)){
            return res.status(400).json({ msg: "Please register first." })
        }
        if(!(userData.token)){
            return res.status(400).json({ msg: 'Please log in first.' })
        }
        req.body.id = id;
    } catch (error) {
        return res.status(400).json({ msg: "Something failed.", Error: error })
    }
    next();
};


// const authorizeSeller = async(req, res, next) => {
//     const id = parseInt(req.params.id);
//     try {
//         const sellerData = await prisma.seller.findUnique({
//             where: { id }
//         })
//         if(!(sellerData)){
//             return res.status(400).json({ msg: "Please register first." })
//         }
//         if(!(sellerData.token)){
//             return res.status(400).json({ msg: 'Please log in first.' })
//         }
//         req.body.id = id;
//         req.body.token = sellerData.token;
//         next();
//     } catch (error) {
//         return res.status(400).json({ msg: 'Something failed.', Error: error })
//     }
// };

module.exports = {
    authentication,
    authorize,
    // authorizeSeller
}

