export const Login = () => {
  return (
    <div class="text-center">
      <a
        class="w-full block p-4 text-xl hover:text-kodot-blue"
        href={import.meta.env.VITE_API_BASE_URL + '/auth/login'}
      >
        Login with GitHub
      </a>
    </div>
  )
}
