const express = require('express')

const router =module.exports =  express.Router()

// router.prefix = '/'

router.get('/',(req,res,next)=>{

    res.render('index.html')

})
router.get('/list',(req,res,next)=>{

    res.render('list.html')
})
router.get('/detail',(req,res,next)=>{

    res.render('detail.html')
})