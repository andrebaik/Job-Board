import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './config/db.js' 
import authRoutes from './routes/authRoutes.js'

dotenv.config({quiet: true})

const app = express()

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    ress.send('backend jalan masbro')
})

app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'API aktif bg'
    })
})

app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result')

    res.json({
      status: 'success',
      message: 'Database udh nyambung bg',
      result: rows[0].result
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database ga nyambung bg',
      error: error.message
    })
  }
})

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`)
})