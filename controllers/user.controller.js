const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {
    saltCode
} = require('../auth/config');

const bcrypt = require('bcryptjs')

const { sendOtp } = require('../services/otp.service')
const { authentication } = require('../auth/jwt');


const signUp = async(req, res) => {
    const { email, password } = req.body;   
    try {
        const isUserExist = await prisma.user.count({
            where: { email }
        })
        if(isUserExist>0){
            return res.status(200).json({
                status: 'NOTOK',
                data: "Email already exists"
            })
        }
        const salt = parseInt(saltCode)
        req.body.password = await bcrypt.hash(password, salt)
        const otp = await sendOtp(email)
        if(!otp){
            return res.status(400).json({
                status: 'NOTOK',
                Error: "Something failed."
            })        }
        // console.log('>>>>',otp);
        req.body.otp = otp;
        const result = await prisma.user.create({
                data: req.body
             })
             res.status(201).json({
                status: 'OK',
                id: result.id,
                data: 'verify your account with this id along with your received otp number.'
            })
    }catch (error) {
        res.status(500).json({
            status: 'NOTOK',
            Error: error.message
        })
    }
};



const otpEnter = async (req, res) => {
    const { id, otp } = req.body;
    try {
        const isValid = await prisma.user.findUnique({
            where: { id }
        })
        if(otp !== isValid.otp){
            return res.status(200).json({
                status: 'NOTOK',
                data: "Invalid otp."
            })        }
        await prisma.user.update({
            where: { id },
            data: { verified: true }
        })
        res.status(200).json({
            status: 'OK',
            data: "Account verified,you can log in now."
        })
    } catch (error) {
        res.status(500).json({
            status: 'NOTOK',
            Error: error.message
        })   
    }
};



const checkUserExist = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if(!user){
            return res.status(200).json({
                status: 'NOTOK',
                data: "Please register first."
            })
        }
        const decrypted = await bcrypt.compare(password, user.password)
        if(!decrypted){
            return res.status(200).json({
                status: 'NOTOK',
                data: "Incorrect Password."
            })
        }
        user.id = parseInt(user.id);
        return user;
    } catch (error) {
        return res.status(500).json({
            status: 'NOTOK',
            Error: error
        })
    }
};

const login = async (req, res) => {
    try {
        const user = await checkUserExist(req, res)
        const { id, email, role } = user;
        if(!user.verified){
            try {
                const otp = await sendOtp(email)
                await prisma.user.update({
                    where: { id },
                    data: { otp }
                })
                return res.status(200).json({
                    status: 'OK',
                    data: `Verify your account with this id ${id} by sending your received otp.`
                })
            } catch (error) {
                return res.status(500).json({
                    status: 'NOTOK',
                    Error: error
                })
            }
        }
        const token = await authentication({ id,role })
        await prisma.user.update({
            where: { id },
            data: { token }
        })
        res.status(200).json({
            status: 'OK',
            data: "Logged in successfully."
        })
    } catch (error) {
        res.status(500).json({
            status: 'NOTOK',
            Error: error
        })
    }
};


const updateProfile = async (req, res) => {
    const { id, email } = req.body;
    if(email){
        return res.status(200).json({
            status: 'NOTOK',
            data: "You can't change your Email."
        })
    }
    try {
        await prisma.user.update({
            where: { id },
            data: req.body
        })
        res.status(200).json({
            status: 'OK',
            data: "Profile updated successfully."
        })
    } catch (error) {
        res.status(500).json({
            status: 'NOTOK',
            Error: error
        })
    }
};



const logOut = async (req, res) => {
    const { id, token } = req.body;
    try {
        await prisma.user.update({
            where: { id },
            data: { token: "" }
        })
        res.status(200).json({
            status: 'OK',
            data: "Signed out successfully."
        })
    } catch (error) {
        res.status(500).json({
            status: 'NOTOK',
            Error: error.message
        })
    }
};



const signOut = async (req, res) => {
    const { id } = req.body;
    try {
        await prisma.user.delete({
            where: { id }
        })
        res.status(200).json({
            status: 'OK',
            data: "Account deleted successfully."
        })
    } catch (error) {
        res.status(500).json({
            status: 'NOTOK',
            Error: error
        })
    }
};


module.exports = {
    signUp,
    otpEnter,
    login,
    updateProfile,
    logOut,
    signOut
}




