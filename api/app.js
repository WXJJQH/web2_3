const express = require('express')

const db = require('./js/crowdfunding_db')

let bodyParser = require('body-parser')

const fs = require('fs')

const multer = require('multer')

const app = express()

const cors = require('cors')

app.use(express.static('images'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// 设置 multer 来处理 multipart/form-data
const upload = multer({ dest: __dirname + '/images' }) //设置上传的目录文件夹
app.use(upload.any())

app.get('/search_page', (req, res) => {
  res.sendFile(__dirname + '/pages/search.html')
})

app.get('/get_fundraiser', (req, res) => {
  db.query('SELECT * FROM fundraiser', (error, results, fields) => {
    if (error) throw error
    // use results.
    console.log('11', results)
    res.send(JSON.stringify(results))
  })
})

app.get('/fundraiser', (req, res) => {
  let id = req.query.id
  db.query('SELECT * FROM fundraiser', (error, results, fields) => {
    if (error) throw error
    // use results.
    console.log('11', results)
    let newRes = results.filter(item => item.FUNDRAISER_ID == id)
    res.send(JSON.stringify(newRes))
  })
})

app.get('/search', (req, res) => {
  let type = parseInt(req.query.type)
  let keyword = req.query.keyword
  let city = req.query.city
  console.log(type, keyword, city)
  db.query('SELECT * FROM fundraiser', (error, results, fields) => {
    if (error) throw error
    // use results.
    // console.log('11', results)
    let newRes = []
    if (type !== 0) {
      newRes = results.filter(item => item.CATEGORY_ID == type)
      // console.log(newRes)
    } else {
      newRes = results
      // console.log(newRes)
    }
    if (city) {
      newRes = newRes.filter(item => item.CITY.trim() == city.trim())
    }
    if (keyword.trim()) {
      newRes = newRes.filter(
        item =>
          item.CITY.includes(keyword) ||
          item.ACTIVE.includes(keyword) ||
          item.ORGANIZER.includes(keyword) ||
          item.TARGET_FUNDING.includes(keyword)
      )
    }
    res.send(JSON.stringify(newRes))
  })
})

app.post('/edit', (req, res) => {
  const info = req.body
  console.log(info)
  const updateQuery =
    'UPDATE fundraiser SET ORGANIZER = ?, TARGET_FUNDING = ?, CURRENT_FUNDING = ?, CITY = ?, CATEGORY_ID = ? WHERE FUNDRAISER_ID = ?'
  let UPDATE = [
    info.organizer,
    info.target,
    info.funding,
    info.city,
    info.type,
    info.id
  ]
  db.query(updateQuery, UPDATE, function (error, results, fields) {
    if (error) throw error
    // 更新成功的操作
    console.log('Row(s) updated: ' + results.affectedRows)
    res.send('ok')
  })
})

app.get('/del', (req, res) => {
  let id = req.query.id
  const deleteSql = `DELETE FROM fundraiser WHERE FUNDRAISER_ID = ?`
  db.query(deleteSql, [id], (error, results, fields) => {
    if (error) {
      // 处理错误
      console.error('error:', error)
      return
    }

    // 删除成功
    console.log('ok:', results.affectedRows)
    res.send('ok')
  })
})

app.post('/uploadfund', (req, res) => {
  let newPath
  req.files.forEach(item => {
    let oldPath = item.path
    newPath = './images/' + Date.now() + item.originalname
    fs.renameSync(oldPath, newPath)
  })
  const formData = req.body
  console.log(newPath.replace('./images/', ''))
  console.log(formData.city)
  const post = {
    ORGANIZER: formData.organize,
    CAPTION: newPath.replace('./images/', ''),
    TARGET_FUNDING: formData.target,
    CURRENT_FUNDING: formData.funding,
    CITY: formData.city,
    ACTIVE: formData.active,
    CATEGORY_ID: formData.type || 1
  }
  const query = 'INSERT INTO fundraiser SET ?'
  db.query(query, post, (error, results, fields) => {
    if (error) throw error
    // 插入成功后的操作（如果有需要）
    console.log('Row inserted')
  })
  res.send('ok')
})

app.listen(5000, () => {
  console.log('The server is http://127.0.0.1:5000/ Start up')
})
