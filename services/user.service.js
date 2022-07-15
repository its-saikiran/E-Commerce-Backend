const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()



const signUpUser = async(data) => {
    try {
        
    } catch (error) {
        return error.message
    }
};



const updateServiceUser = async(id, data) => {
    try {
        const isLoggedIn = await prisma.user.findUnique({
            where: { id }
        })
        if(!isLoggedIn){
            return {
                msg: "Please log in first.",
                token: null
            }
        }
        await prisma.user.update({
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



const logoutServiceUser = async(id) => {
    try {
        await prisma.user.update({
            where: { id },
            data: { token: null }
        })
        return "Log out successfully."
    } catch (error) {
        return error.message
    }
};


module.exports = {
    signUpUser,
    otpServiceUser,
    updateServiceUser,
    logoutServiceUser,
}