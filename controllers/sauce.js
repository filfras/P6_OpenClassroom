const Sauce = require('../models/sauce')
const fs = require('fs')

exports.createSauce = (req, res, next) => {
  req.body.sauce = JSON.parse(req.body.sauce)
  const url = req.protocol + '://' + req.get('host')
  const sauce = new Sauce({
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    imageUrl: url + '/images/' + req.file.filename,
    mainPepper: req.body.sauce.mainPepper,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    userId: req.body.sauce.userId,
  })
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Post saved successfully!',
      })
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      })
    })
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce)
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      })
    })
}

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id })
  if (req.file) {
    const url = req.protocol + '://' + req.get('host')
    req.body.sauce = JSON.parse(req.body.sauce)
    sauce = {
      _id: req.params.id,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      imageUrl: url + '/images/' + req.file.filename,
      mainPepper: req.body.sauce.mainPepper,
      heat: req.body.sauce.heat,
      userId: req.body.sauce.userId,
    }
  } else {
    sauce = {
      _id: req.params.id,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      mainPepper: req.body.mainPepper,
      heat: req.body.heat,
      userId: req.body.userId,
    }
  }
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      res.status(201).json({
        message: 'Sauce updated successfully!',
      })
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      })
    })
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      return res.status(404).json({
        error: new Error('Object not found!'),
      })
    }
    if (sauce.userId !== req.auth.userId) {
      return res.status(401).json({
        error: new Error('Request not authorized!'),
      })
    }
  })

  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split('/images/')[1]
    //fs'  unlink()  method lets you delete a file from the file system.
    fs.unlink('images/' + filename, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: 'Deleted!',
          })
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          })
        })
    })
  })
}

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces)
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      })
    })
}

exports.likesAndDislikes = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    let updateSauce = {
      likes: sauce.likes,
      dislikes: sauce.dislikes,
      usersDisliked: sauce.usersDisliked,
      usersLiked: sauce.usersLiked,
    }

    if (req.body.like === 1) {
      updateSauce.usersLiked.push(req.body.userId)
      updateSauce.likes = updateSauce.usersLiked.length
      console.log('User Liked!')
    } else if (req.body.like === -1) {
      updateSauce.usersDisliked.push(req.body.userId)
      updateSauce.dislikes = updateSauce.usersDisliked.length
      console.log('User Disliked!')
    } else if (req.body.like === 0) {
      if (updateSauce.usersLiked.includes(req.body.userId)) {
        updateSauce.usersLiked.pull(req.body.userId)
        updateSauce.likes = updateSauce.usersLiked.length
        console.log('User Liked Cancelled!')
      } else {
        updateSauce.usersDisliked.pull(req.body.userId)
        updateSauce.dislikes = updateSauce.usersDisliked.length
        console.log('User Disliked Cancelled!')
      }
    }

    Sauce.updateOne({ _id: req.params.id }, updateSauce)
      .then(() => {
        res.status(201).json({
          message: 'Sauce updated successfully!',
        })
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        })
      })
  })
}
