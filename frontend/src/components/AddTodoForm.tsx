import { useState } from 'react'
import type { FormEvent } from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

interface AddTodoFormProps {
  onAdd: (title: string) => void
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setTitle('')
  }

  return (
    <Stack component="form" direction="row" spacing={1} onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <TextField
        label="New todo"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        size="small"
        fullWidth
      />
      <Button type="submit" variant="contained">
        Add
      </Button>
    </Stack>
  )
}
