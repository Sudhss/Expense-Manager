import { useState, useCallback } from 'react'
import { Lock, User, LogIn, Wallet, Eye, EyeOff } from 'lucide-react'

const api = (url, body) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(async r => {
    const j = await r.json()
    if (!r.ok) throw new Error(j.error)
    return j
  })

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const validEmail = email => /\S+@\S+\.\S+/.test(email)
  const validPassword = p => p.length >= 6

  const loginWithGoogle = useCallback(async (token) => {
    const { token: jwt } = await api('/api/auth/google', { id_token: token })
    localStorage.setItem('jwt', jwt)
    onLogin(true)
  }, [onLogin])

  const handleGoogle = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId || !window.google) {
      setError('Google login unavailable')
      return
    }
    setIsGoogleLoading(true)
    try {
      await new Promise((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async resp => {
            try {
              await loginWithGoogle(resp.credential)
              resolve()
            } catch (e) {
              reject(e)
            }
          }
        })
        window.google.accounts.id.prompt(() => {})
      })
    } catch (e) {
      setError(e.message)
    }
    setIsGoogleLoading(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (!validEmail(credentials.username)) {
      setError('Enter a valid email')
      return
    }
    if (!validPassword(credentials.password)) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      const { token } = isRegister
        ? await api('/api/auth/register', credentials)
        : await api('/api/auth/login', credentials)
      localStorage.setItem('jwt', token)
      onLogin(true)
    } catch (e) {
      setError(e.message)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Expense Manager
            </h1>
            <p className="text-gray-600 mt-2">
              {isRegister ? 'Create your account' : 'Sign in to manage your finances'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="username"
                placeholder="Email"
                value={credentials.username}
                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 placeholder-gray-500"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full pl-12 pr-12 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl animate-slide-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {isRegister ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isGoogleLoading}
              onClick={handleGoogle}
              className="w-full bg-white text-gray-700 py-3.5 rounded-2xl font-medium border border-[#dadce0] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.156,7.949,3.051l5.657-5.657C33.674,6.053,29.077,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.156,7.949,3.051l5.657-5.657 C33.674,6.053,29.077,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.802-1.977,13.294-5.196l-6.147-5.197C29.087,35.091,26.671,36,24,36 c-5.202,0-9.619-3.317-11.275-7.946l-6.54,5.036C9.513,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.793,2.237-2.231,4.166-4.106,5.607l6.147,5.197C36.983,39.19,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              {isRegister ? (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setIsRegister(false); setError('') }} className="text-primary-600 font-medium hover:underline">
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New here?{' '}
                  <button type="button" onClick={() => { setIsRegister(true); setError('') }} className="text-primary-600 font-medium hover:underline">
                    Create an account
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login