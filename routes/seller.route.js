const router = require('express').Router();
const { authorizeSeller } = require('../auth/jwt');

const {
  signUp,
  otpEnter,
  login,
  updateProfile,
  logOut,
  signOut
} = require('../controllers/seller.controller')

const { signUpChecks } = require('../middlewares/sellerChecks/signUpChecks');
const { isValidOtp } = require('../middlewares/isValidOtp');
const { loginChecks } = require('../middlewares/loginChecks');

router.post('/register', signUpChecks, signUp);
router.post('/otp', isValidOtp, otpEnter);
router.post('/login', loginChecks, login);
router.patch('/update/:id', authorizeSeller, updateProfile);
router.patch('/logout/:id', authorizeSeller, logOut);
router.delete('/signout/:id', authorizeSeller, signOut);


const { 
  getProducts,
  getProductById,
  getProductsBySellerId,
  postProduct
} = require('../controllers/product.controller');

router.get('/products', authorizeSeller, getProducts)
router.get('/product/:id', authorizeSeller, getProductById)
router.get('/products/seller/:sellerId', authorizeSeller, getProductsBySellerId)
router.post('/product/:id', authorizeSeller, postProduct)
// router.patch('/product/:id', authorize, updateProduct)
// router.delete('/product/:id', authorize, deleteProduct)


module.exports = router;