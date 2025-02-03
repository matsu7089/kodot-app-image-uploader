import { createSignal, onMount, Show } from 'solid-js'
import { Login } from './components/Login'
import { ImageUploader } from './components/ImageUploader'
import { loadVips } from './utils'

type User = {
  id: string
  login: string
}

function App() {
  const [token, setToken] = createSignal<string | null>(null)
  const [user, setUser] = createSignal<User | null>(null)

  onMount(async () => {
    const paramToken = new URLSearchParams(location.search).get('token')
    const token = localStorage.getItem('token') || paramToken

    if (!token) {
      return
    }

    if (paramToken) {
      const url = new URL(location.href)
      url.searchParams.delete('token')
      history.replaceState(null, '', url.toString())
    }

    const userInfo = await fetch(
      import.meta.env.VITE_API_BASE_URL + '/auth/user',
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          Authorization: `token ${token}`,
        },
      }
    )

    if (userInfo.ok) {
      const user = await userInfo.json()
      setUser(user)
      setToken(token)
      localStorage.setItem('token', token || '')
      loadVips()
    } else {
      localStorage.removeItem('token')
    }
  })

  return (
    <div class="min-h-screen bg-kodot-blue">
      <header class="p-4 bg-white flex justify-between text-kodot-blue">
        <div>
          <div>Kodot App</div>
          <div>Image Uploader</div>
        </div>
        <Show when={user()}>
          <div>
            <div>user: {user()?.login}</div>
            <div class="text-right">
              <a href={import.meta.env.VITE_API_BASE_URL + '/auth/logout'}>
                Logout
              </a>
            </div>
          </div>
        </Show>
      </header>
      <div class="m-4 p-4 pixel-border bg-white">
        <Show when={user()} fallback={<Login />}>
          <ImageUploader token={token()} />
        </Show>
      </div>
    </div>
  )
}

export default App
