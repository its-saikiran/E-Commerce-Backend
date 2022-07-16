const router = require('express').Router();
const { authorize } = require('../auth/jwt');

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
router.patch('/update', authorize, updateProfile);
router.patch('/logout', authorize, logOut);
router.delete('/signout', authorize, signOut)


const { 
  getProducts,
  getProductById,
  getProductsBySellerId,
} = require('../controllers/product.controller');

router.get('/products', authorize, getProducts)
router.get('/product/:id', authorize, getProductById)
router.get('/products/:sellerId', authorize, getProductsBySellerId)

module.exports = router;
