module.exports.isValidEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ; 
    return regex.test(email)                 
};


module.exports.isValidPassword = (password) => {
    const regex = /^(?=.*\d).{8,}$/ ;
    return regex.test(password)
};