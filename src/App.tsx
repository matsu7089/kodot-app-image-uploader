import { createSignal, onMount, Show } from 'solid-js'
import { Login } from './components/Login'
import { ImageUploader } from './components/ImageUploader'
import { loadVips } from './utils'

type User = {
  id: string
  login: string
}

function App() {
  const [user, setUser] = createSignal<User | null>(null)

  onMount(async () => {
    const userInfo = await fetch(
      import.meta.env.VITE_API_BASE_URL + '/auth/user',
      {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      }
    )

    if (userInfo.ok) {
      const user = await userInfo.json()
      setUser(user)
      loadVips()
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
          <ImageUploader />
        </Show>
      </div>
    </div>
  )
}

export default App
