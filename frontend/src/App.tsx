import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { todosApi, type Todo } from './api'
import AddTodoForm from './components/AddTodoForm'
import TodoItem from './components/TodoItem'

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    todosApi
      .list()
      .then(setTodos)
      .catch(() => setError('Could not reach the server. Is the API running?'))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(title: string) {
    const created = await todosApi.create(title)
    setTodos((current) => [...current, created])
  }

  async function handleToggle(id: number, done: boolean) {
    const updated = await todosApi.update(id, { done })
    setTodos((current) => current.map((todo) => (todo.id === id ? updated : todo)))
  }

  async function handleDelete(id: number) {
    await todosApi.remove(id)
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1">
            MYDOS
          </Typography>
          <AddTodoForm onAdd={handleAdd} />
          {error && <Alert severity="error">{error}</Alert>}
          {loading ? (
            <CircularProgress />
          ) : todos.length === 0 && !error ? (
            <Typography variant="body1" color="text.secondary">
              No todos yet — add one above.
            </Typography>
          ) : (
            <List sx={{ width: '100%' }}>
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
              ))}
            </List>
          )}
        </Stack>
      </Box>
    </Container>
  )
}
