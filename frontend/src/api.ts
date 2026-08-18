// One base URL, read from one environment variable, used by one client
// module. Never a literal `/api/...` scattered through components — that
// breaks the day this app is served from a sub-path.
//
// Empty (the production default: the backend serves this app itself, so the
// API lives one path segment away from wherever the page was loaded) means a
// *relative* request, resolved by the browser against the current document's
// URL — the same strategy `vite.config.ts` uses for asset URLs. A leading
// slash here would resolve from the domain root instead, which is correct at
// `/` and wrong under any reverse-proxy prefix.
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export interface Todo {
  id: number
  title: string
  done: boolean
  created_at: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = BASE_URL ? `${BASE_URL}/api${path}` : `api${path}`
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!response.ok) {
    throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${response.status}`)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export const todosApi = {
  list: () => request<Todo[]>('/todos'),
  create: (title: string) =>
    request<Todo>('/todos', { method: 'POST', body: JSON.stringify({ title }) }),
  update: (id: number, patch: Partial<Pick<Todo, 'title' | 'done'>>) =>
    request<Todo>(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  remove: (id: number) => request<void>(`/todos/${id}`, { method: 'DELETE' }),
}
