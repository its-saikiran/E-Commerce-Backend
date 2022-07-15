const {
    isValidEmail,
    isValidPassword,
} = require('../isValidEmailPass')

const signUpChecks = async(req, res, next) => {
    try {
        const { name, email, password, confirmPassword, phoneNumber } = req.body;
        if(!(name && email && password && confirmPassword && phoneNumber)){
            return res.status(400).json( { msg: "Insuffcient information." })
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
        delete req.body.confirmPassword;
    } catch (error) {
        return res.status(404).json( { Error: 'Something failed.' })
    }
    next();
};


module.exports = {
    signUpChecks,
}