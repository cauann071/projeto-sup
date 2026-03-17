import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(cors())
app.use(express.json())

// Configuração Supabase
const supabaseUrl = 'https://SEU-PROJETO.supabase.co'
const supabaseKey = 'SUA_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

const PORT = process.env.PORT || 3000

// 🔹 ROTAS CRUD

// READ: listar todos os usuários
app.get('/usuarios', async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .order('id', { ascending: true })

  if (error) return res.status(500).json({ erro: error.message })
  res.json(data)
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

// UPDATE: editar usuário
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params
  const { nome } = req.body
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' })

  const { error } = await supabase
    .from('usuarios')
    .update({ nome })
    .eq('id', id)

  if (error) return res.status(500).json({ erro: error.message })
  res.json({ sucesso: true })
})

// DELETE: apagar usuário
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id)

  if (error) return res.status(500).json({ erro: error.message })
  res.json({ sucesso: true })
})

// Rota teste
app.get('/', (req, res) => {
  res.send('Servidor rodando!')
})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))