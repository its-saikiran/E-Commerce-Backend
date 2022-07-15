const {
    isValidEmail,
    isValidPassword
} = require('../isValidEmailPass')

const signUpChecks = async(req, res, next) => {
    try {
        const { name, email, password, confirmPassword, phoneNumber, gstNumber, role } = req.body;
        if(!(name && email && password && confirmPassword && phoneNumber)){
            return res.status(400).json( { msg: "Insuffcient information." })
        }
        if(!gstNumber){
            return res.status(400).json( { msg: "gstNumber are very important for seller to register." })
        }
        if(!isValidEmail(email)){
            return res.status(400).json( { msg: "Please enter a valid email address." })
        }
        if(!isValidPassword(password)){
            return res.status(400).json( { msg: "Password should contain atleast 8 characters." })
        }
        if(password !== confirmPassword){
            return res.status(400).json( { msg: "Password does not match." })
        }
    } catch (error) {
        return res.status(500).json( { msg: error })
    }
    next();
};


module.exports = {
    signUpChecks
};