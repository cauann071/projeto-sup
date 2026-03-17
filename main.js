import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(cors())
app.use(express.json()) // Permite receber JSON no body

// Config Supabase
const supabaseUrl = 'https://bclfmimjjbegykwyfttw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbGZtaW1qamJlZ3lrd3lmdHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NzA4ODUsImV4cCI6MjA4OTM0Njg4NX0.7wI4Lh_lb9BHrOxtYNW6YVNP20IE4b5EitzTxgzkOFk'
const supabase = createClient(supabaseUrl, supabaseKey)

// PORTA
const PORT = process.env.PORT || 3000

// 🔹 ROTAS CRUD

// READ: listar mensagens
app.get('/mensagens', async (req, res) => {
  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return res.status(500).json({ erro: error.message })
  res.json(data)
})

// CREATE: enviar mensagem
app.post('/mensagens', async (req, res) => {
  const { conteudo } = req.body
  if (!conteudo) return res.status(400).json({ erro: 'Conteúdo é obrigatório' })

  const { data, error } = await supabase
    .from('mensagens')
    .insert([{ conteudo }])

  if (error) return res.status(500).json({ erro: error.message })
  res.json({ sucesso: true, data })
})

// UPDATE: editar mensagem
app.put('/mensagens/:id', async (req, res) => {
  const { id } = req.params
  const { conteudo } = req.body
  if (!conteudo) return res.status(400).json({ erro: 'Conteúdo é obrigatório' })

  const { error } = await supabase
    .from('mensagens')
    .update({ conteudo })
    .eq('id', id)

  if (error) return res.status(500).json({ erro: error.message })
  res.json({ sucesso: true })
})

// ROTA TESTE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

document.addEventListener('DOMContentLoaded', () => {
  const inputNome = document.getElementById('nome')
  const btnSalvar = document.getElementById('btnSalvar')
  const mensagem = document.getElementById('mensagem')

  function mostrarMensagem(msg, isErro = true) {
    mensagem.textContent = msg
    mensagem.style.color = isErro ? 'red' : 'green'
  }

  btnSalvar.addEventListener('click', async () => {
    const nome = inputNome.value.trim()
    if (!nome) {
      mostrarMensagem('Digite um nome!')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
      })

      const data = await response.json()

      if (!response.ok) {
        mostrarMensagem(data.erro || 'Erro ao salvar')
      } else {
        mostrarMensagem('Salvo com sucesso!', false)
        inputNome.value = ''
        inputNome.focus()
      }

    } catch (err) {
      mostrarMensagem('Erro de conexão')
      console.error(err)
    }
  })
})