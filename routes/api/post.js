const express = require('express')
const uploads = require('../../middlewares/uploads')
const router = module.exports = express.Router()
const db = require('../../utils/db')
router.prefix = '/api/post'

router.post('/save', uploads.single('feature'), (req, res, next) => {
    const { body, file } = req
    db.query('INSERT INTO `ali_article` SET ?', {
        article_title: body.title,
        article_body: body.content,
        article_adminid: req.session.user.admin_id, // 文章作者，当前登录用户的 id
        article_cateid: body.category,
        article_slug: body.slug,
        // article_addtime: body
        article_status: body.status,
        article_file: `/${file.destination}/${file.filename}` // 存储上传文件的 Web 访问路径
    }, (err, ret) => {
        if (err) {
            return next(err)
        }

        // 3. 发送响应结果
        res.send({
            success: true,
            data: ret
        })
    })
})