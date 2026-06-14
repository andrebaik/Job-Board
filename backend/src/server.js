import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import db from './config/db.js' 
import authRoutes from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import statsRoutes from './routes/statsRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

dotenv.config({quiet: true})

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express()

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get('/', (req, res) => {
    res.send('backend jalan masbro')
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

app.use('/api/jobs', jobRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)     
app.use('/api/profiles', profileRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/admin', adminRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`aman bg, Server berjalan di port ${PORT}`)
})