const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()



const createServiceSeller = async(data) => {
    try {
        const result = await prisma.seller.create({ data })
        return {
            id: result.id,
            msg: "Check otp with this id"
        }
    } catch (error) {
        return error.message
    }
};


const otpServiceSeller = async (id) => {
    try {
        const data = await prisma.seller.findUnique({
            where: { id }
        })
        return data
    } catch (error) {
        return error.message
    }
};


const updateServiceSeller = async(id, data) => {
    try {
        const isLoggedIn = await prisma.seller.findUnique({
            where: { id }
        })
        if(!isLoggedIn){
            return {
                msg: "Please log in first.",
                token: null
            }
        }
        await prisma.seller.update({
            where: { id },
            data
        })
        return {
            msg: "Updated successfully.",
            token: isLoggedIn.token
        }
    } catch (error) {
        return error.message
    }
}



const logoutServiceSeller = async(id) => {
    try {
        await prisma.seller.update({
            where: { id },
            data: { token: null }
        })
        return "Log out successfully."
    } catch (error) {
        return error.message
    }
};


module.exports = {
    createServiceSeller,
    otpServiceSeller,
    updateServiceSeller,
    logoutServiceSeller,
}