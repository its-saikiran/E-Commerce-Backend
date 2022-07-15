const router = require('express').Router();
const { authorizeUser } = require('../auth/jwt');

const {
  signUp,
  otpEnter,
  login,
  updateProfile,
  logOut,
  signOut
} = require('../controllers/user.controller')

const { signUpChecks } = require('../middlewares/userChecks/signUpChecks');
const { isValidOtp } = require('../middlewares/isValidOtp');
const { loginChecks } = require('../middlewares/loginChecks');

router.post('/register', signUpChecks, signUp);
router.post('/otp', isValidOtp, otpEnter);
router.post('/login', loginChecks, login);
router.patch('/update/:id', authorizeUser, updateProfile);
router.patch('/logout/:id', authorizeUser, logOut);
router.delete('/signout/:id', authorizeUser, signOut)


const { 
  getProducts,
  getProductById,
  getProductsBySellerId,
} = require('../controllers/product.controller');

router.get('/products', authorizeUser, getProducts)
router.get('/product/:id', authorizeUser, getProductById)
router.get('/products/seller/:sellerId', authorizeUser, getProductsBySellerId)

module.exports = router;
