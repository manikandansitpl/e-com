const Product = require("../models/productSchema");
const Customer = require("../models/customerSchema");

const productCreate = async (req, res) => {
    try {
        const product = new Product(req.body)

        let result = await product.save();

        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getProducts = async (req, res) => {
    try {
        let products = await Product.find().populate("seller", "shopName");
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getProductFilter = async (req, res) => {
    // Extract query parameters if they exist; otherwise set to undefined

    const {id, brand, color, subcategory, cost ,rating} = req.query;
  console.log(cost);
    // Initialize the query conditions array
    let queryConditions = [];

    // Add subcategory to query conditions if it exists
    if (subcategory) {
        queryConditions.push({ subcategory: new RegExp(subcategory, "i") });
    }

    // Add brand to query conditions if it exists
    if (brand) {
        let brands = brand.split(',');
        let regexBrands = brands.map(b => new RegExp(b, "i"));
        queryConditions.push({ brand: { $in: regexBrands } });
    }

    // Add color to query conditions if it exists
    if (color) {
        queryConditions.push({ color: new RegExp(color, "i") });
    }
    // Add cost (price range) to query conditions if it exists
    // Assuming 'cost' is a string like "10000-50000"
    if (cost) {
        let [minCost, maxCost] = cost.split('-').map(Number);
        queryConditions.push({ 'price.cost': { $gt: minCost || 0, $lt: maxCost || Infinity } });
     
    }
    // Always apply a fixed condition for review rating
    if(rating){
        queryConditions.push({ 'reviews.rating': rating });
    }

    if(id){
        queryConditions.push({_id:id})
    }

    // Construct the final query using $and only if there are conditions to apply
    let finalQuery = queryConditions.length > 0 ? { $and: queryConditions } : {};
    console.log(finalQuery)
    try {
        let products = await Product.find(finalQuery);
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSellerProducts = async (req, res) => {
    try {
        let products = await Product.find({ seller: req.params.id })
        if (products.length > 0) {
            res.send(products)
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getProductDetail = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)
            .populate("seller", "shopName")
            .populate({
                path: "reviews.reviewer",
                model: "customer",
                select: "name"
            });

        if (product) {
            res.send(product);
        }
        else {
            res.send({ message: "No product found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateProduct = async (req, res) => {
    try {
        let result = await Product.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const addReview = async (req, res) => {
    try {
        const { rating, comment, reviewer } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);

        const existingReview = product.reviews.find(review => review.reviewer.toString() === reviewer);

        if (existingReview) {
            return res.send({ message: "You have already submitted a review for this product." });
        }

        product.reviews.push({
            rating,
            comment,
            reviewer,
            date: new Date(),
        });

        const updatedProduct = await product.save();

        res.send(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
};
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
const searchProduct = async (req, res) => {
    try {
        const key = req.params.key;
        const escapedInput = escapeRegex(key);
        let products = await Product.find({
            $or: [
                { productName: { $regex: escapedInput, $options: 'i' } },
                { subcategory: { $regex: escapedInput, $options: 'i' } },
                {brand :{$regex: escapedInput, $options:'i'}},
                // {_id :key},
            ]
        }).populate("seller", "shopName");

        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};



const getBrandFilter = async (req, res) => {
    const {brand} = req.query;
    let data =brand.split(",")

    const brandConditions = data.map(brand => ({
        brand: { $regex: new RegExp('^' + brand + '$', 'i') }
      }));
    try {
         let products = await Product.find({ $or: brandConditions })
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getProductByBrandColor=async(req,res)=>{
    try {
         // Check if query parameters exist before splitting or converting
    const brand = req.query.brand ? req.query.brand.split(',') : [];
    const color = req.query.color ? req.query.color.split(',') : [];
    const min = req.query.min ? Number(req.query.min) : null; // Use null as a fallback
    const max = req.query.max ? Number(req.query.max) : null;

    // Create regex arrays only if parameters exist
    const regexKeysBrand = brand.length ? brand.map(item => new RegExp(item, 'i')) : [];
    const regexKeysColor = color.length ? color.map(item => new RegExp(item, 'i')) : [];

    // Constructing the query conditionally
    let query = { $and: [] };

    if (regexKeysBrand.length) {
        query.$and.push({ brand: { $in: regexKeysBrand } });
    }

    if (regexKeysColor.length) {
        query.$and.push({ color: { $in: regexKeysColor } });
    }

    // Adding price range conditions if min and max are provided
    if (min !== null) {
        query.$and.push({ "price.cost": { $gte: min } });
    }

    if (max !== null) {
        query.$and.push({ "price.cost": { $lte: max } });
    }

    // If there's nothing in $and (no query parameters were provided), find all products
    if (!query.$and.length) delete query.$and;

    try {
        let products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    } catch (error) {
        res.status(500).json(error);
    }
}


const getSubCategory=async(req,res)=>{
    try {
        const key = req.params.key;
        let products = await Product.find({
            $or: [
                { category: { $regex: key, $options: 'i' } },
            ]
        })

        if (products.length > 0) {
            let subcat = products.map((item)=> item.subcategory)
            let uniq = [...new Set(subcat)]
            res.send(uniq);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const getBrands=async(req,res)=>{
    try {
        const key = req.params.key;
        const keyArray = key.split(",");
        const regexKeys = keyArray.map(item => new RegExp(item, 'i'));

        let products = await Product.find({
            $or: [
                { subcategory: { $in: regexKeys } }, // Use regex array for case-insensitive search
            ]
        });
        if (products.length > 0) {
            let subcat = products.map((item)=> item.brand)
            let uniq = [...new Set(subcat)]
            res.send(uniq);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const getColor=async(req,res)=>{
    try {
        const key = req.params.key;
        const keyArray = key.split(",");
        const regexKeys = keyArray.map(item => new RegExp(item, 'i'));

        let products = await Product.find({
            $or: [
                { brand: { $in: regexKeys } }, // Use regex array for case-insensitive search
            ]
        });
        if (products.length > 0) {
            let subcat = products.map((item)=> item.color)
            let uniq = [...new Set(subcat)]
            res.send(uniq);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const filterProduct = async (req, res) => {
    const { categories, subcategories, brands, colors } = req.body;

    const query = {
        subCategory: { $in: subcategories},
      };
    try {
        // Assuming Product is the model connected to your MongoDB collection
        const products = await Product.find(query);
        res.json(products); // Sending back the matched products
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("An error occurred while fetching products.");
    }
};


const filterdByColor=async(req,res)=>{
    try {
        const subCategory = req.query.subcategory;
        const color = req.query.color;
        const brand = req.query.brand;

        let products = await Product.find({subcategory:subCategory})
        let filterd = products.filter(item=> item.brand.toLowerCase() === brand)
        .filter(item => item.color.toLowerCase() === color.toLowerCase())
        .map(res => res.color)

        if (products.length > 0) {
            let uniq = [...new Set(filterd)]
            res.send(uniq);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const searchProductbyCategory = async (req, res) => {
    try {
        const key = req.params.key;

        let products = await Product.find({
            $or: [
                { category: { $regex: key, $options: 'i' } },
            ]
        }).populate("seller", "shopName");

        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const searchProductbySubCategory = async (req, res) => {
    try {
        const key = req.params.key;

        let products = await Product.find({
            $or: [
                { subcategory: { $regex: key, $options: 'i' } }
            ]
        }).populate("seller", "shopName");

        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        await Customer.updateMany(
            { "cartDetails._id": deletedProduct._id },
            { $pull: { cartDetails: { _id: deletedProduct._id } } }
        );

        res.send(deletedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteProducts = async (req, res) => {
    try {
        const deletionResult = await Product.deleteMany({ seller: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No products found to delete" });
            return;
        }

        const deletedProducts = await Product.find({ seller: req.params.id });

        await Customer.updateMany(
            { "cartDetails._id": { $in: deletedProducts.map(product => product._id) } },
            { $pull: { cartDetails: { _id: { $in: deletedProducts.map(product => product._id) } } } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};


const deleteProductReview = async (req, res) => {
    try {
        const { reviewId } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);

        const updatedReviews = product.reviews.filter(review => review._id != reviewId);

        product.reviews = updatedReviews;

        const updatedProduct = await product.save();

        res.send(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteAllProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        product.reviews = [];

        const updatedProduct = await product.save();

        res.send(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getInterestedCustomers = async (req, res) => {
    try {
        const productId = req.params.id;

        const interestedCustomers = await Customer.find({
            'cartDetails._id': productId
        });

        const customerDetails = interestedCustomers.map(customer => {
            const cartItem = customer.cartDetails.find(item => item._id.toString() === productId);
            if (cartItem) {
                return {
                    customerName: customer.name,
                    customerID: customer._id,
                    quantity: cartItem.quantity,
                };
            }
            return null; // If cartItem is not found in this customer's cartDetails
        }).filter(item => item !== null); // Remove null values from the result

        if (customerDetails.length > 0) {
            res.send(customerDetails);
        } else {
            res.send({ message: 'No customers are interested in this product.' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAddedToCartProducts = async (req, res) => {
    try {
        const sellerId = req.params.id;

        const customersWithSellerProduct = await Customer.find({
            'cartDetails.seller': sellerId
        });

        const productMap = new Map(); // Use a Map to aggregate products by ID
        customersWithSellerProduct.forEach(customer => {
            customer.cartDetails.forEach(cartItem => {
                if (cartItem.seller.toString() === sellerId) {
                    const productId = cartItem._id.toString();
                    if (productMap.has(productId)) {
                        // If product ID already exists, update the quantity
                        const existingProduct = productMap.get(productId);
                        existingProduct.quantity += cartItem.quantity;
                    } else {
                        // If product ID does not exist, add it to the Map
                        productMap.set(productId, {
                            productName: cartItem.productName,
                            quantity: cartItem.quantity,
                            category: cartItem.category,
                            subcategory: cartItem.subcategory,
                            productID: productId,
                        });
                    }
                }
            });
        });

        const productsInCart = Array.from(productMap.values());

        if (productsInCart.length > 0) {
            res.send(productsInCart);
        } else {
            res.send({ message: 'No products from this seller are added to cart by customers.' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    productCreate,
    getProducts,
    getSellerProducts,
    getProductDetail,
    updateProduct,
    addReview,
    searchProduct,
    searchProductbyCategory,
    searchProductbySubCategory,
    deleteProduct,
    deleteProducts,
    deleteProductReview,
    deleteAllProductReviews,
    getInterestedCustomers,
    getAddedToCartProducts,
    getSubCategory,
    getBrands,
    getColor,
    getProductByBrandColor,
    filterdByColor,
    filterProduct,
    getBrandFilter,
    getProductFilter
};