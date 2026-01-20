const express= require('express')
const router= express.Router()
const catchAsync = require('../helper/catchAsync')
const {loggedCheck, validateProduct, isAuthor}= require('../middleware')
const productsController= require('../controllers/products')
const multer  = require('multer')
const {storage}= require('../cloudinary')
const upload = multer({ storage })

router.get('/', catchAsync(productsController.index))

router.post(
  '/',
  loggedCheck,
  upload.array('image'),
  validateProduct,
  catchAsync(productsController.newFormPost)
)

router.get('/:id', catchAsync(productsController.showById))

router.put(
  '/:id',
  loggedCheck,
  isAuthor,
  upload.array('image'),
  validateProduct,
  catchAsync(productsController.editFormPost)
)

router.delete(
  '/:id',
  loggedCheck,
  isAuthor,
  catchAsync(productsController.productDelete)
)

module.exports = router