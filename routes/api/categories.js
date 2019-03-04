const express = require('express')
const db = require('../../utils/db')
const router = module.exports =express.Router()
router.prefix = '/api/categories'

//列表加载
router.get('/',(req,res,next)=>{
    db.query('SELECT * FROM `ali_cate`', (err, ret) => {
      if (err) { return next(err) }
          // 发送响应给客户端
          res.send({
            success: true,
            data: ret
          })
    })

})

//删除分类
router.get('/delete', (req, res, next) => {
    const { id } = req.query
    db.query('DELETE FROM `ali_cate` WHERE `cate_id`=?', [id], (err, ret) => {
      if (err) { return next(err) }
      res.send({
        success: true
      })
    })
  })

//添加分类
router.post('/create',(req,res,next)=>{
    const body = req.body
    db.query('INSERT INTO `ali_cate` SET ?', {
        cate_name: body.name,
        cate_slug: body.slug
      }, (err, ret) => {
        if (err) { return next(err) }
        // 3. 发送响应
        res.send({
          success: true,
          data: ret
        })
      })
})
//编辑模态框显示
router.get('/query',(req,res,next)=>{
  // 1. 获取查询字符串中的数据 id
  const { id } = req.query

  // 2. 操作数据库，执行查询 SQL 语句
  db.query('SELECT * FROM `ali_cate` WHERE `cate_id`=?', [id], (err, ret) => {
    if (err) { return next(err) }

    // 3. 发送响应
    res.send({
      success: true,
      data: ret[0]
    })
  })

})
//模态框编辑好内容
router.post('/update',(req,res,next)=>{
  const body = req.body
  db.query('UPDATE `ali_cate` SET `cate_name`=?, `cate_slug`=? WHERE `cate_id`=?',
  [body.cate_name,body.cate_slug,body.cate_id],
  (err,ret)=>{

    if (err) { return next(err) }
    res.send({
      success:true,
      data:ret
    })
  })
})