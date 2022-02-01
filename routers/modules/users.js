const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
// 導入models/user.js
const passport = require('passport')

const db = require('../../models')
const User = db.User

router.get('/login', (req, res) => {
  res.render('login')
})
// 加入middleware, 驗證request登入狀態
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }

    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

// router.post('/register', (req, res) => {
//   const { name, email, password, confirmPassword } = req.body
//   const errors = []
//   if(!name || !email || !password || !confirmPassword) {
//      errors.push({ message: '所有欄位都是必填！'})
//   }
//   if(password !== confirmPassword) {
//     errors.push({ message: '密碼與確認密碼不相符！'})
//   }
//   if(errors.length) {
//     return res.render('register', {
//         errors,
//         name,
//         email,
//         password,
//         confirmPassword
//       })
//   }

//   User.findOne({where: { email }}).then(user => {
//     if (user) {
//       errors.push({ message: '此信箱已經註冊過！'})
//       return res.render('register', {
//         errors,
//         name,
//         email,
//         password,
//         confirmPassword
//       })
//     } 

//     return bcrypt
//       .genSalt(10) //產生難度為10的鹽
//       .then(salt => bcrypt.hash(password, salt)) //為使用者密碼加鹽,產生雜湊值
//       .then(hash => User.create({
//         name,
//         email,
//         password: hash //將雜湊值取代資料庫原本的密碼
//       }))      
//         .then(() => res.redirect('/'))
//         .catch(err => console.log(err))
//   })
// })

// router.get('/logout', (req, res) => {
//   req.flash('success_msg', '您已成功登出！')
//   req.logout()
//   res.redirect('/users/login')
// })

module.exports = router