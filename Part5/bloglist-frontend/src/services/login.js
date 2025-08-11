import axios from 'axios'
const baseUrl = '/api/login' 
const login = async (credentials) => {
  try {
    const response = await axios.post(baseUrl, credentials)
    return response.data 
  } catch (error) {
    console.error('Login failed:', error.response?.data?.error || error.message)
    throw new Error(error.response?.data?.error || 'Login failed')
  }
}

const logout = async () => {
  try {
    await axios.post('/api/logout')
  } catch (error) {
    console.error('Logout error:', error)
  }
  window.localStorage.removeItem('loggedBlogUser')
}

export default { login, logout }