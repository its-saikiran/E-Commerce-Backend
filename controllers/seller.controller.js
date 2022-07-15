const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs')
const {
    saltCode,
} = require('../auth/config');

const { sendOtp } = require('../services/otp.service')
const { authentication } = require('../auth/jwt');


const signUp = async (req, res) => {
    const { email, password } = req.body;
    try {
        const isSellerExist = await prisma.seller.count({
            where: { email }
        })
        if (isSellerExist > 0) {
            return res.status(200).json({
                status: 'NOTOK',
                data: "Email already exists"
            })
        }
        delete req.body.confirmPassword;
        const salt = parseInt(saltCode)
        req.body.password = await bcrypt.hash(password, salt)
        const otp = await sendOtp(email)
        if (!otp) {
            return res.status(400).json({
                status: 'NOTOK',
                Error: "Something failed."
            })
        }
        // console.log('>>>>',otp);
        req.body.otp = otp;
        const result = await prisma.seller.create({
            data: req.body
        })
        res.status(201).json({
            status: 'OK',
            id: result.id,
            data: 'verify your account with this id along with your received otp number.'
        })
    } catch (error) {
        res.status(500).json({
            status: 'NOTOK',
            Error: error
        })
    }
};



const otpEnter = async (req, res) => {
    const { id, otp } = req.body;
    try {
        const isValid = await prisma.seller.findUnique({
            where: { id }
        })
        if (otp !== isValid.otp) {
            return res.status(200).json({
                status: 'NOTOK',
                data: "Invalid otp."
            })
        }
        await prisma.seller.update({
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
            Error: error
        })
    }
};


const checkSellerExist = async(req, res) => {
    const { email, password } = req.body;
    try {
        const seller = await prisma.seller.findUnique({
            where: { email }
        })
        if(!seller){
            return res.status(200).json({
                status: 'NOTOK',
                data: "Please register first."
            })
        }
        const decrypted = await bcrypt.compare(password, seller.password)
        if(!decrypted){
            return res.status(200).json({
                status: 'NOTOK',
                data: "Incorrect Password."
            })
        }
        seller.id = parseInt(seller.id);
        return seller;
    } catch (error) {
        return res.status(500).json({
            status: 'NOTOK',
            data: { Error: error }
        })
    }
};

const login = async (req, res) => {
    try {
        const seller = await checkSellerExist(req, res)
        const { id, email, role } = seller;
        if(!seller.verified){
            try {
                const otp = await sendOtp(email)
                await prisma.seller.update({
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
                    Error: error.message
                })
            }
        }
        const token = await authentication({ id,role })
        await prisma.seller.update({
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
    const id = parseInt(req.params.id);
    const { email } = req.body;
    if (email) {
        return res.status(200).json({
            status: 'NOTOK',
            data: "You can't change your Email."
        })
    }
    try {
        await prisma.seller.update({
            where: { id },
            data: req.body
        })
        res.status(200).json({
            status: 'OK',
            data: "Updated profile successfully."
        })
    } catch (error) {
        res.status(500).json({
            status: 'NOTOK',
            Error: error
        })
    }

};


const logOut = async (req, res) => {
    try {
        await prisma.seller.update({
            where: { id: req.body.id },
            data: { token: "" }
        })
        res.status(200).clearCookie().json({
            status: 'OK',
            data: "Signed out successfully."
        })
    } catch (error) {
        res.status(500).json({
            status: 'NOTOK',
            Error: error
        })
    }
};




const signOut = async (req, res) => {
    const { id } = req.body;
    try {
        await prisma.seller.delete({
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
    signOut,
}