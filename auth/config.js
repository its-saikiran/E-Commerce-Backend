require('dotenv').config();

const config = {
    port: process.env.PORT || 7000,
    databaseURL: process.env.DATABASE_URL || " ",
    saltCode: process.env.SALT_CODE || 7,
    secretKey: process.env.SECRET_KEY || 'I will be the SECRET_KEY if that not works.',
    nodemailerEmail: process.env.NODEMAILER_EMAIL || 'iam@gmail.com',
    nodemailerPassword: process.env.NODEMAILER_PASSWORD || 'iamthepassword',
    nodemailerFrom: process.env.NODEMAILER_FROM || 'iam@gmail.com',
    lengthOfOtp: process.env.LENGTH_OF_OTP || 4
}

module.exports = config;