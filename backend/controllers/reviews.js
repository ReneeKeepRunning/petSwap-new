const Product = require('../types/products');
const Review = require('../types/review');

module.exports.reviewCreate = async (req, res, next) => {
    try {
        const foundproduct = await Product.findById(req.params.id);
        if (!foundproduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const review = new Review(req.body.review);
        review.author = req.user._id;
        await review.save();

        foundproduct.review.push(review);
        await foundproduct.save();

        res.status(201).json({
            message: 'Review created successfully',
            review,
            productId: foundproduct._id
        });
    } catch (err) {
        next(err);
    }
};

module.exports.reviewDelete = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;

        await Review.findByIdAndDelete(reviewId);
        const productUpdate = await Product.findByIdAndUpdate(id, { $pull: { review: reviewId } });

        res.json({
            message: 'Review deleted successfully',
            productId: id,
            reviewId
        });
    } catch (err) {
        next(err);
    }
};
