import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { todosApi } from '../api'

vi.mock('../api', () => ({
  todosApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

const mockedApi = vi.mocked(todosApi)

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows the empty state once loading finishes', async () => {
    mockedApi.list.mockResolvedValue([])
    render(<App />)
    expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument()
  })

  it('shows an error when the server cannot be reached', async () => {
    mockedApi.list.mockRejectedValue(new Error('network down'))
    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not reach the server/i)
  })

  it('lists todos returned by the API', async () => {
    mockedApi.list.mockResolvedValue([
      { id: 1, title: 'Buy milk', done: false, created_at: '2024-01-01T00:00:00Z' },
    ])
    render(<App />)
    expect(await screen.findByText('Buy milk')).toBeInTheDocument()
  })

  it('adds a todo through the form', async () => {
    const user = userEvent.setup()
    mockedApi.list.mockResolvedValue([])
    mockedApi.create.mockResolvedValue({
      id: 2,
      title: 'Walk dog',
      done: false,
      created_at: '2024-01-01T00:00:00Z',
    })
    render(<App />)
    await screen.findByText(/no todos yet/i)

    await user.type(screen.getByLabelText(/new todo/i), 'Walk dog')
    await user.click(screen.getByRole('button', { name: /add/i }))

    expect(await screen.findByText('Walk dog')).toBeInTheDocument()
    expect(mockedApi.create).toHaveBeenCalledWith('Walk dog')
  })

  it('toggles a todo done via its checkbox', async () => {
    const user = userEvent.setup()
    mockedApi.list.mockResolvedValue([
      { id: 1, title: 'Buy milk', done: false, created_at: '2024-01-01T00:00:00Z' },
    ])
    mockedApi.update.mockResolvedValue({
      id: 1,
      title: 'Buy milk',
      done: true,
      created_at: '2024-01-01T00:00:00Z',
    })
    render(<App />)
    const checkbox = await screen.findByRole('checkbox')
    await user.click(checkbox)
    await waitFor(() => expect(mockedApi.update).toHaveBeenCalledWith(1, { done: true }))
  })

  it('deletes a todo via its delete button', async () => {
    const user = userEvent.setup()
    mockedApi.list.mockResolvedValue([
      { id: 1, title: 'Buy milk', done: false, created_at: '2024-01-01T00:00:00Z' },
    ])
    mockedApi.remove.mockResolvedValue(undefined)
    render(<App />)
    const item = await screen.findByText('Buy milk')
    const list = item.closest('ul') as HTMLElement
    await user.click(within(list).getByRole('button', { name: /delete/i }))
    await waitFor(() => expect(mockedApi.remove).toHaveBeenCalledWith(1))
  })
})
