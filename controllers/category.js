const Category = require('../models/category')
const Sub = require('../models/sub')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    const { name } = req.body
    // const category = await new Category({ name, slug: slugify(name) }).save()
    res.json(await new Category({ name, slug: slugify(name) }).save())
  } catch (error) {
    console.error(error)
    res.status(400).send('Create category failed')
  }
}

exports.list = async (req, res) => {
  try {
    res.json(await Category.find({}).sort({ createdAt: -1 }).exec())
    console.log(`Categories retrieved.`)
  } catch (error) {
    console.error(error)
    res.status(400).send('Failed to retrieve categories')
  }
}

exports.read = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.slug }).exec()
    console.log(`Category retrieved: ${category}`)
    res.json(category)
  } catch (error) {
    console.error(error)
    res.status(400).send('Failed to retrieve category')
  }
}

exports.update = async (req, res) => {
  try {
    const { name } = req.body
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true },
    )
    console.log(`Category updated: ${updated}`)
    res.json(updated)
  } catch (error) {
    console.error(error)
    res.status(400).send('Failed to update category')
  }
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug })
    console.log(`Category deleted: ${deleted}`)
    res.json(deleted)
  } catch (error) {
    console.error(error)
    res.status(400).send('Failed to delete category')
  }
}

exports.getSubs = async (req, res) => {
  Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) console.error(err)
    res.json(subs)
  })
}
