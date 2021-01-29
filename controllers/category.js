const Category = require('../models/category')
const slugify = require('slugify')

exports.create = async (req, res) =>{
    try {
        const {name} = req.body
        // const category = await new Category({ name, slug: slugify(name) }).save()
        res.json(await new Category({ name, slug: slugify(name) }).save())
    } catch (error) {
        console.error(error)
        res.status(400).send('Create category failed')
    }
}

exports.list = async (req, res) =>{
    try {
        
    } catch (error) {
        
    }
}

exports.read = async (req, res) =>{
    try {
        
    } catch (error) {
        
    }
}

exports.update = async (req, res) =>{
    
}

exports.remove = async (req, res) =>{
    
}