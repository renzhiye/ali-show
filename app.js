const express = require('express')
const path = require('path')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
// const router = require('./routes')
// const adminrouter = require('./routes/admin')
// const apirouter = require('./routes/api/categories')
const sessionStore = new MySQLStore({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alishow'
  })

const glob = require('glob')
const files = glob.sync('./routes/**/*.js')
// console.log(files)
// console.log(session)





const app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore, // 告诉 express-session 中间件，使用 sessionStore 持久化 Session 数据
  }))

// 配置请求中间件权限
// app.use('/admin',(req,res,next)=>{
//     if(req.originalUrl ==='/admin/login'){
//         return next()
//     }
//     const sessionUser = req.session.user
//     if(!sessionUser){
//         return res.redirect('/admin/login')
//     }

//     res.locals.foo = sessionUser

//     next()

// })


//配置获得post请求体
app.use(express.urlencoded())


app.engine('html',require('express-art-template'))
app.set('view option',{
    debug:process.env.NODE_ENV !== 'production'
})
// app.get('/',(req,res)=>{
//     res.render('index.html')
//     // res.send('hellop')
// })
// app.use(router)
// app.use('/admin',adminrouter)
// app.use('/api',apirouter)

files.find(routerPath=>{
    const router = require(routerPath)
    if (typeof router === 'function') {
        app.use(router.prefix || '/', router)
      }
})

//全局错误处理
app.use((err,req,res,next)=>{
    res.status(500).send({
        statusCpde:500,
        message:'internal server error',
        error:err.message
    })

})


//配置静态资源
app.use('/public', express.static(path.join(__dirname, './public')))
app.listen(2080,()=>console.log('开始监听 http://127.0.0.1:2080'))