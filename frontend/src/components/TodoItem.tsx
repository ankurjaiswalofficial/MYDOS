import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Todo } from '../api'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number, done: boolean) => void
  onDelete: (id: number) => void
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const labelId = `todo-label-${todo.id}`

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label={`Delete "${todo.title}"`}
          onClick={() => onDelete(todo.id)}
        >
          <DeleteIcon />
        </IconButton>
      }
      disablePadding
      sx={{ py: 0.5 }}
    >
      <Checkbox
        edge="start"
        checked={todo.done}
        onChange={(event) => onToggle(todo.id, event.target.checked)}
        slotProps={{ input: { 'aria-labelledby': labelId } }}
      />
      <ListItemText
        id={labelId}
        primary={todo.title}
        sx={{ textDecoration: todo.done ? 'line-through' : 'none' }}
      />
    </ListItem>
  )
}
