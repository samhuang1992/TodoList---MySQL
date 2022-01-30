const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// get new 
router.get('/new', (req, res) => {
  return res.render('new')
})
// post new
router.post('/', (req, res) => {
  const userId = req.user.id
  const name = req.body.name
  return Todo.create({ name, userId })
    .then(()=> res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:id', (req,res) => {
  const userId = req.user.id
  const _id = req.params.id
  return Todo.findByPk({_id, userId})
  
  .then((todo) => res.render('detail', { todo: todo.toJSON() }))
  .catch(error => console.log(error))
})

// update get URL
router.get('/:id/edit', (req,res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Todo.findByPk({_id, userId})
  .lean()
  .then((todo) => res.render('edit', { todo: todo.toJSON() }))
  .catch(error => console.log(error))
})
// update post URL
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const {name, isDone} = req.body //解構賦值, 一次定義好req.body內的變數 
  const _id = req.params.id
  return Todo.findByPk({_id, userId})
    .then(todo => {
      todo.name = name
      //運算子優先序, 先比 isDone ==='on', 再將結果比對todo.isDone
      todo.isDone = isDone === 'on' 
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${_id}`))
    .catch(error => console.log(error))
}) 
// Remove post URL
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Todo.findByPk({_id, userId})
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 匯出路由模組
module.exports = router