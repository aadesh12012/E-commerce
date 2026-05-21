const userModel = require("../models/User");
const productModel = require("../models/product");

const addtocart = async (req, res) => {

    try {

        const { userId, productId } = req.body;

        const user = await userModel.findById(userId);

        const product = await productModel.findById(productId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

       const existingProduct = user.cart.find(
    item =>
        item.productId &&
        item.productId.toString() === productId
);

if (existingProduct) {

    existingProduct.quantity += 1;

} else {

    user.cart.push({
        productId,
        quantity: 1
    });

}

        await user.save();

        res.json({
            message: "Product added to cart",
            cart: user.cart
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error adding product to cart"
        });

    }

};
const listcart = async (req, res) => {

    try {

        const { userId } = req.params;

        const user = await userModel
            .findById(userId)
            .populate("cart.productId");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json(user.cart);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error listing cart"
        });

    }

};


const removeitem = async (req, res) => {

    try {

        const { userId, cartItemId } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (cartItemId) {
            user.cart = user.cart.filter(item => item._id.toString() !== cartItemId);
        }

        await user.save();

        res.status(200).json({
            message: "Item removed from cart",
            cart: user.cart
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error
        });

    }

};




const carttotal = async (req, res) => {

    try {

        const { userId } = req.params;

        const user = await userModel
            .findById(userId)
            .populate("cart.productId");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        let totalAmount = 0;

        user.cart.forEach((item) => {

            if (item.productId) {

                totalAmount +=
                    item.productId.price * item.quantity;

            }

        });

        res.status(200).json({
            totalAmount,
            cart: user.cart
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error calculating cart total"
        });

    }

};




module.exports = {addtocart,listcart,removeitem,carttotal};