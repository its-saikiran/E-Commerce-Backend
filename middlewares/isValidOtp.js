const isValidOtp = async(req, res, next) => {
    try {
        const { id, otp } = req.body;
        if(!(id && otp)){
            return res.status(400).json({ msg: "Insufficient information." })
        }
        if(otp.length !== 6){
            return res.status(400).json( { msg: "Invalid otp." })
        } 
        req.body.id = parseInt(id);
    } catch (error) {
        res.status(400).json( { Error: error })
    }
    next();
};


module.exports = {
    isValidOtp
}