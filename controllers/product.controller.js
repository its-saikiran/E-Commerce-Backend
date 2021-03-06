const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getProducts = async(req, res) => {
    try {
        const data = await prisma.product.findMany()
        res.status(200).json( { data: data.length === 0? "There are no products.": data })
    } catch (error) {
        res.status(500).json({ Error: error })
    }
};


const getProductById = async(req, res) => {
    const id = parseInt(req.params.id);
    try {
        const data = await prisma.product.findUnique({
            where: { id }
        })
        res.status(200).json({ data: data? data: "There is no product with this id" })
    } catch (error) {
        res.status(500).json({ Error: error })
    }
};


const getProductsBySellerId = async(req, res) => {
    const sellerId = parseInt(req.params.sellerId)
    try {
        const data = await prisma.product.findMany({
            where: { sellerId }
        })
        res.status(200).json({ data: data.length === 0? "There are no product with this seller id." : data })
    } catch (error) {
        res.status(500).json({ Error: error })
    }
};


const postProduct = async(req, res) => {
    req.body.sellerId = req.body.id;
    delete req.body.id;
    try {
        await prisma.product.create({
            data: req.body
        })
        res.status(201).json({
            status: 'OK',
            data: 'successfully added.'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'NOTOK',
            Error: error
        })
    }
}


module.exports = {
    getProducts,
    getProductById,
    getProductsBySellerId,
    postProduct
}