const mysql = require('mysql')

// 创建连接对象
const connection = mysql.createConnection({
  host: 'localhost', // 数据库服务器地址
  user: 'yli138_202401_2', // 数据库用户名
  password: '20241017OC', // 数据库密码
  database: 'yli138_crowdfunding_db' // 数据库名
})

connection.connect()
// 执行查询
// const check_fund = () => {
//   connection.query('SELECT * FROM fundraiser', (error, results, fields) => {
//     if (error) throw error
//     // 使用results
//     console.log('11', results)
//   })
// }
// check_fund()
module.exports = connection