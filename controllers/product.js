const Product = require('../models/product')
const User = require('../models/user')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    console.log(req.body)
    req.body.slug = slugify(req.body.title)
    const newProduct = await new Product(req.body).save()
    res.json(newProduct)
  } catch (err) {
    console.error(err)
    // res.status(400).send('Create product failed')
    res.status(400).json({
      err: err.message,
    })
  }
}

exports.listAll = async (req, res) => {
  try {
    let products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate('category')
      .populate('subs')
      .sort([['createdAt', 'desc']])
      .exec()
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(400).json({
      err: err.message,
    })
  }
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec()
    res.json(deleted)
  } catch (err) {
    console.error(err)
    return res.status(400).send('Product delete failed')
  }
}

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('subs')
    .exec()
  res.json(product)
}

exports.update = async (req, res) => {
  try {
    // set slug from title
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true },
    ).exec()
    res.json(updated)
  } catch (err) {
    console.error('Product Update error: ', err)
    res.status(400).json({
      err: err.message,
    })
  }
}

// without pagination
// return all products based on sort, order, limit
// exports.list = async (req, res) => {
//   try {
//     const { sort, order, limit } = req.body
//     const products = await Product.find({})
//       .populate('category')
//       .populate('subs')
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec()
//     res.json(products)
//   } catch (err) {
//     console.error('Products post error: ', err)
//   }
// }

// with pagination
exports.list = async (req, res) => {
  try {
    const { sort, order, page } = req.body
    // console.table(req.body)
    const currentPage = page || 1
    const perPage = 3

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subs')
      .sort([[sort, order]])
      .limit(perPage)
      .exec()
    res.json(products)
  } catch (err) {
    console.error('Products list error: ', err)
  }
}

exports.productsCount = async (req, res) => {
  try {
    let total = await Product.find({}).estimatedDocumentCount().exec()
    res.json(total)
  } catch (err) {
    console.error('Products count error: ', err)
  }
}

exports.productStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec()
    const user = await User.findOne({ email: req.user.email }).exec()
    const { star } = req.body

    // check if currently logged in user has already rated product
    let existingRatingObject = product.ratings.find(
      (element) => element.postedBy.toString() === user._id.toString(),
    )

    // if user hasn't left rating yet, push it
    if (existingRatingObject === undefined) {
      let ratingsAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star, postedBy: user.id } },
        },
        { new: true },
      ).exec()
      console.log('ratingsAdded', ratingsAdded)
      res.json(ratingsAdded)
    } else {
      // if user has already left rating, update it
      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        { $set: { 'ratings.$.star': star } },
        { new: true },
      ).exec()
      console.log('ratingUpdated', ratingUpdated)
      res.json(ratingUpdated)
    }
  } catch (err) {
    console.error('Product star error: ', err)
  }
}
