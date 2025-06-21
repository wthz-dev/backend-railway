// index.js
import express from 'express'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

app.get('/', (req, res) => {
  res.send('Backend API พร้อมแล้ว!')
})

app.get('/users', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users')
  res.json(rows)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`API พร้อมให้ยิงที่ http://localhost:${port}`)
})
