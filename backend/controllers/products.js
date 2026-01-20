const Product = require('../types/products');
const { cloudinary } = require('../cloudinary');
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapboxToken = process.env.MAPBOX_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapboxToken });

// const categories = ['dental', 'health', 'shower', 'other'];

module.exports.index = async (req, res) => {
  try {
    const products = await Product.find({});
    console.log('products:' , products)
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.newFormPost = async (req, res, next) => {
    try {
        const newProduct = new Product(req.body.product);
        newProduct.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
        newProduct.author = req.user._id;

        await newProduct.save();

        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });
    } catch (err) {
        next(err);
    }
};

module.exports.showById = async (req, res) => {
    const { id } = req.params;
    const foundproduct = await Product.findById(id)
        .populate({
            path: 'review',
            populate: { path: 'author', select: 'username' }
        })
        .populate('author', 'username');

    if (!foundproduct) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(foundproduct);
};


module.exports.editFormPost = async (req, res) => {
    const { id } = req.params;
    const foundProduct = await Product.findByIdAndUpdate(
        id,
        { ...req.body.product },
        { new: true, runValidators: true }
    );

    // Add new images
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    foundProduct.image.push(...imgs);
    await foundProduct.save();

    // Delete selected images
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await foundProduct.updateOne({
            $pull: { image: { filename: { $in: req.body.deleteImages } } }
        });
    }

    res.json({
        message: "Product updated successfully",
        product: foundProduct
    });
};

module.exports.productDelete = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);

    res.json({
        message: "Product deleted successfully",
        id
    });
};
