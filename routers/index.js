const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const users = require('./modules/users')
const todo = require('./modules/todo')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')  
const { authorize } = require('passport')

router.use('/todo', authenticator, todo)
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home)


module.exports = router