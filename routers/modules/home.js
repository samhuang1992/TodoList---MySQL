const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

app.get('/', (req, res) => {
  const userId = req.body.id
  console.log(userId)
  return Todo.findAll({
    raw: true,
    nest: true
  })
    .sort({ _id: 'asc' })
    .then(todos =>  res.render('index', { todos }))
    .catch(error => console.log(error))
})

module.exports = router