const express = require('express')
const session = require('express-session')
const passport = require('passport')
const {engine} = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
// passport設定檔，要寫在 express-session後
const usePassport = require('./config/passport')
const db = require('./models')
const User = db.User
const Todo = db.Todo

const app = express()
const PORT = 3000

app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'MySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

app.use(flash())
// 設定變數res.locals 
app.use((req, res, next)=> {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') //設定成功訊息
  res.locals.warning_msg = req.flash('warning_msg') //設定錯誤訊息
  next()
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})