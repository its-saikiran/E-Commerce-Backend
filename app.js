const express = require('express')
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        user: {
            signUp: '/user/register',
            otp: '/user/otp',
            login: '/user/login',
            update: '/user/update/:id',
            logOut: '/user/logout/:id',
            delete: '/user/signout/:id',
            products: {
                getProducts: '/user/products',
                getProductsId: '/user/product/:id',
                getProductsBySellerId: '/products/seller/:sellerId'

            }
        },
        seller: {
            signUp: '/seller/register',
            otp: '/seller/otp',
            login: '/seller/login',
            update: '/seller/update/:id',
            logOut: '/seller/logout/:id',
            delete: '/seller/signout/:id',
            products: {
                getProducts: '/seller/products',
                getProductsId: '/seller/product/:id',
                getProductsBySellerId: '/products/seller/:sellerId'

            }
        },
        products: {
            getProducts: '/product/all',
            getProductById: '/product/:id',
            getProductsBySellerId: '/product/seller/:sellerId'
        }
    })
});

app.use('/user', require('./routes/user.route'));
app.use('/seller', require('./routes/seller.route'));
app.use('/product', require('./routes/product.route'));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))