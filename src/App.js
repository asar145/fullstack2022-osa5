import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogSubmitForm from './components/BlogSubmitForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [cssClass, setCssClass] = useState('confirmation')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const refreshBlogs = () => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('trying login')

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setCssClass('error')
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = (blog) => {
    console.log('Submitting blog with', blog.title, blog.author, blog.url)
    try {
      blogService.create(blog).then(() => refreshBlogs())
      blogFormRef.current.toggleVisibility()
      setCssClass('confirmation')
      setErrorMessage(`a new blog ${blog.title} by ${blog.author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      console.log('blog submit error')
    }
  }

  const handleLike = (blog) => {
    console.log('Liked blog: ', blog.title)
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user
    }

    try {
      blogService.update(blog.id, updatedBlog).then(() => refreshBlogs())
    } catch (exception) {
      console.log('like submit error')
    }
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      console.log('delete blog: ', blog.title)
      try {
        blogService.deleteBlog(blog.id).then(() => refreshBlogs())
      } catch (exception) {
        console.log('delete request error')
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} cssClass={cssClass}/>
        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          password
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="loginButton">login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} cssClass={cssClass}/>
      <p>{user.name} logged in <button onClick={() => handleLogout()}> logout </button></p>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogSubmitForm createBlog={createBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} username={user.username}
          handleLike={handleLike} handleDelete={handleDelete} />
      )}
    </div>
  )
}

export default App
