const fs = require('fs')
const path = require('path')
const vars = require('../../../../configs/vars')
const { Movies } = require(vars.dirs.models)


exports.get = async (req, res, next) => {
  try {
    let moviesData = []
    if(req.params.id) {
      const id = req.params.id
      moviesData = await Movies.findOne( { _id: id } )
    }
    else {
      moviesData = await Movies.find()
    }
    return res.json(moviesData)
  }
  catch(e) {
    next(e)
  }
}

exports.add = async (req, res, next) => {
  try {
    if(Object.values(req.file).length > 0) {
      if(req.file.filename && req.file.path) {
        req.body.poster = req.file.filename
      }
    }
    const movie = new Movies(req.body)
    await movie.save()
    return res.json(movie)
  }
  catch(e) {
    next(e)
  }
}

exports.update = async (req, res, next) => {
  try {
    const { id } = req.body
    const result = await Movies.updateOne( { _id: id }, { $set: req.body })
    if(!result.nModified) {
      throw new Error("Internal Error")
    }
    return res.json( { success: true, message: "Updated successfully" } )
  }
  catch(e) {
    next(e)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.body
    const result = await Movies.deleteOne( { _id: id } )
    if(!result.deletedCount) {
      throw new Error("Internal Error")
    }
    return res.json( { success: true, message: "Deleted successfully" } )
  }
  catch(e) {
    next(e)
  }
}

exports.getImage = async (req, res, next) => {
  try {
    let img = req.params.img
    let dynamicPath = vars.dirs.project + "/uploads/" + img
    console.log(dynamicPath)
    if(fs.existsSync(dynamicPath)) {
      return res.sendFile(dynamicPath)
    }
    return res.send('File not found')
  }
  catch(e) {
    next(e)
  }
}
