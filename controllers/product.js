const Product = require('../models/product')
const User = require('../models/user')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    // console.log(req.body)
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

exports.listRelated = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec()

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(3)
      .populate('category')
      .populate('subs')
      .populate('postedBy')
      .exec()

    res.json(related)
  } catch (error) {
    console.error('Related list error: ', err)
  }
}

// Search / Filter
const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec()

  res.json(products)
}

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .exec()

    res.json(products)
  } catch (err) {
    console.error('handlePrice error: ', err)
  }
}

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .exec()

    res.json(products)
  } catch (err) {
    console.error('handleCategory error: ', err)
  }
}

const handleStar = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: '$$ROOT',
        floorAverage: {
          $floor: { $avg: '$ratings.star' },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log('AGGREGATE ERROR', err)
      Product.find({ _id: aggregates })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, products) => {
          if (err) console.log('PRODUCT AGGREGATE ERROR', err)
          res.json(products)
        })
    })
}

const handleSub = async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec()

  res.json(products)
}

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec()

  res.json(products)
}

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec()

  res.json(products)
}

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec()

  res.json(products)
}

exports.searchFilters = async (req, res) => {
  const {
    query,
    price,
    category,
    stars,
    sub,
    shipping,
    color,
    brand,
  } = req.body

  if (query) {
    console.log('query', query)
    await handleQuery(req, res, query)
  }

  // price [range]
  if (price !== undefined) {
    console.log('price ---> ', price)
    await handlePrice(req, res, price)
  }

  if (category) {
    console.log('category ---> ', category)
    await handleCategory(req, res, category)
  }

  if (stars) {
    console.log('stars ---> ', stars)
    await handleStar(req, res, stars)
  }

  if (sub) {
    console.log('sub ---> ', sub)
    await handleSub(req, res, sub)
  }

  if (shipping) {
    console.log('shipping ---> ', shipping)
    await handleShipping(req, res, shipping)
  }

  if (color) {
    console.log('color ---> ', color)
    await handleColor(req, res, color)
  }

  if (brand) {
    console.log('brand ---> ', brand)
    await handleBrand(req, res, brand)
  }
}
