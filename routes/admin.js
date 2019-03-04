const express = require('express')

const router = module.exports = express.Router()
router.prefix = '/admin'
router.get('/', (req, res,next) => {
    res.render('admin/index.html')  
})

router.get('/login', (req, res, next) => {
    res.render('admin/login.html')
})

router.get('/categories', (req, res, next) => {
    // const sessionUser = req.session.user
    // if(!sessionUser){return res.redirect('/admin/login')}
    // res.render('admin/categories.html',{foo:req.session.user})
    res.render('admin/categories.html')

})

router.get('/users',(req,res,next)=>{
    res.render('admin/users.html')
})
router.get('/posts',(req,res,next)=>{
    res.render('admin/posts.html')
})
router.get('/post-add',(req,res,next)=>{
    res.render('admin/post-add.html')
})