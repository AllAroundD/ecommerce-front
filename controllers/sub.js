const Sub = require('../models/sub')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body
    res.json(await new Sub({ name, slug: slugify(name), parent }).save())
  } catch (error) {
    console.error('Sub create error: ', error)
    res.status(400).send('Create sub category failed')
  }
}

exports.list = async (req, res) => {
  try {
    res.json(await Sub.find({}).sort({ createdAt: -1 }).exec())
    console.log(`Sub categories retrieved`)
  } catch (error) {
    console.error(error)
    res.status(400).send('Failed to retrieve sub categories')
  }
}

exports.read = async (req, res) => {
  try {
    let sub = await Sub.findOne({ slug: req.params.slug }).exec()
    console.log(`Sub retrieved: ${sub}`)
    res.json(sub)
  } catch (error) {
    console.error(error)
    res.status(400).send('Failed to retrieve sub category')
  }
}

exports.update = async (req, res) => {
  try {
    const { name, parent } = req.body
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true },
    )
    console.log(`Sub category updated: ${updated}`)
    res.json(updated)
  } catch (error) {
    console.error(error)
    res.status(400).send('Failed to update sub category')
  }
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug })
    console.log(`Sub category deleted: ${deleted}`)
    res.json(deleted)
  } catch (error) {
    console.error(error)
    res.status(400).send('Failed to delete sub category')
  }
}
