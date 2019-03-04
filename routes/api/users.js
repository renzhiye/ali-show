const express = require('express')
const db = require('../../utils/db')
const md5 = require('../../utils/md5')
const router = module.exports = express.Router()

router.prefix = '/api/users'

router.get('/', (req, res, next) => {
  db.query('select * from ali_admin', (err, ret) => {
    if (err) { return next(err) }
    res.send({
      success: true,
      data: ret
    })
  })

})

//添加用户
router.post('/add', (req, res, next) => {
  const body = req.body
 
  //验证邮箱
  db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?', [body.email], (err, ret) => {
    
    if (err) {
      return next(err)
    }

    // ret [][0] undefined false
    // ret [数据][0] 数据对象 true
    if (ret[0]) {
      return res.send({
        success: false,
        message: '邮箱已被占用'
      })
    }
    
    // 2.2.2 验证别名是否可用
    db.query('SELECT * FROM `ali_admin` WHERE `admin_slug`=?', [body.slug], (err, ret) => {
      
      if (err) {
        return next(err)
      }
      if (ret[0]) {
        return res.send({
          success: false,
          message: '别名已被占用'
        })
      }

      // 2.2.3 验证昵称是否可用
      db.query('SELECT * FROM `ali_admin` WHERE `admin_nickname`=?', [body.nickname], (err, ret) => {
        
        if (err) {
          return next(err)
        }
        if (ret[0]) {
          return res.send({
            success: false,
            message: '昵称已被占用'
          })
        }

        // 邮箱、别名、昵称都没有被占用，可以使用，执行插入操作完成用户注册
        // 3. 校验通过，执行数据插入操作
        db.query('INSERT INTO `ali_admin` SET ?', {
          admin_email: body.email,
          admin_slug: body.slug,
          admin_nickname: body.nickname,
          admin_pwd: md5(md5(body.password))
        }, (err, ret) => {
          if (err) {
            return next(err)
          }

          // 4. 发送响应
          res.send({
            success: true,
            data: ret
          })
        })
      })
    })
  })
})

//异步验证邮箱
router.get('/check_email', (req, res, next) => {
  // 1. 获取查询参数 admin_email
  const { admin_email } = req.query

  // 2. 操作数据库，查询 admin_email 是否已存在
  db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?', [admin_email], (err, ret) => {
    if (err) {
      return next(err)
    }

    // 3. 如果已存在，则发送响应 false
    //    如果不存在，表示可以使用，发送响应 true
    res.send(ret[0] ? false : true)
  })
})
//用户登录
router.post('/login',(req,res,next)=>{
  const body = req.body
  db.query('select * from ali_admin where admin_email=?',[body.email],(err,ret)=>{
    const user = ret[0]
    if(err){return next(err)}
    

    if(!ret[0]){
      return res.send({
        success:false,
      })
    }
    db.query('select * from ali_admin where admin_email=?',[body.pwd],(err,ret)=>{
      if (md5(md5(body.pwd)) !== user.admin_pwd) {
        return res.send({
          success: false,
          message: '密码错误'
        })
      }

      req.session.user = user
      res.send({
        success: true,
        message: '登录成功'
      })
    })
  })

})

//用户退出
router.get('/logout', (req, res, next) => {
  // 1. 清除登录状态
  delete req.session.user
  // 2. 跳转到登录页
  res.redirect('/admin/login')
})
router.get('/categories', (req, res, next) => {

  res.redirect('/admin/login')
})
//删除用户
router.get('/delete',(req,res,next)=>{
  const {id}=req.query
  db.query('delete from ali_admin where admin_id=?',[id],(err,ret)=>{
    console.log(ret)
    if(err){ return next(err)}
    res.send({
      success:true,
      data:ret
    })

  })

})
//模态框展示
router.get('/edit',(req,res,next)=>{
  const {id} = req.query
  
  db.query('select * from ali_admin where admin_id=?',[id],(err,ret)=>{
    if(err){return next(err)}
    res.send({
      success:true,
      data:ret
    })
  })
})
//模态框编辑内容
router.post('/updata',(req,res,next)=>{
  const body = req.body
  db.query('UPDATE `ali_cate` SET `admin_email`=?, `admin_nickname`=? WHERE `admin_id`=?',
  [body.admin_email,body.admin_nickname,body.admin_id],
  (err,ret)=>{

    if (err) { return next(err) }
    res.send({
      success:true,
      data:ret
    })
  })
})