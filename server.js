import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

const supabaseUrl = 'https://bclfmimjjbegykwyfttw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbGZtaW1qamJlZ3lrd3lmdHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NzA4ODUsImV4cCI6MjA4OTM0Njg4NX0.7wI4Lh_lb9BHrOxtYNW6YVNP20IE4b5EitzTxgzkOFk'
const supabase = createClient(supabaseUrl, supabaseKey)

const PORT = process.env.PORT || 6534

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
// CREATE: adicionar usuário
app.post('/usuarios', async (req, res) => {
  const { nome } = req.body
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' })

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nome }])

  if (error) return res.status(500).json({ erro: error.message })
  res.json({ sucesso: true, data })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});