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
            update: '/user/update',
            logOut: '/user/logout',
            delete: '/user/signout',
            products: {
                getProducts: '/user/products',
                getProductsId: '/user/product/:id',
                getProductsBySellerId: '/user/products/:sellerId'

            }
        },
        seller: {
            signUp: '/seller/register',
            otp: '/seller/otp',
            login: '/seller/login',
            update: '/seller/update',
            logOut: '/seller/logout',
            delete: '/seller/signout',
            products: {
                getProducts: '/seller/products',
                getProductsId: '/seller/product/:id',
                getProductsBySellerId: '/seller/products/:sellerId',
                postProduct: '/seller/product'

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