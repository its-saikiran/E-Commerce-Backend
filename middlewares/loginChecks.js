const {
    isValidEmail,
    isValidPassword,
} = require('../middlewares/isValidEmailPass')

const loginChecks = async (req, res, next) => {
    try {
        // console.log(isValidEmail, isValidPassword);
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({ msg: "Insuffcient information." })
        }
        if (!(isValidEmail(email))) {
            return res.status(400).json({ msg: "Please enter a valid email." })
        }
        if (!(isValidPassword(password))) {
            return res.status(400).json({ msg: "Password should contain atleast 8 characters." })
        }
        next();
    } catch (error) {
        res.status(500).json({ status: "Something failed.", Error: error.message })
    }
};

module.exports = {
    loginChecks
}