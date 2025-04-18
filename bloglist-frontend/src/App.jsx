import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, errorMessage }) => {

  if (message === null && errorMessage === null) {
    return null
  } else if (message === null) {

    return (
      <div className='error'>
        {errorMessage}
      </div>
    )
  } else {
    return (
      <div className='good'>
        {message}
      </div>
    )
  }
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()

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

      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObj = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    try {
      const newBlog = await blogService.createBlog(blogObj)
      setBlogs(blogs.concat(newBlog))
      setNewAuthor('')
      setNewTitle('')
      setNewUrl('')
      setMessage(`a new blog '${newBlog.title}' by '${newBlog.author}' added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage('Please make sure you fill in all fields')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={message} errorMessage={errorMessage} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }


  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} Looged-in
        <button type="button"
          onClick={logout}>Log out</button>
      </p>

      <Notification message={message} errorMessage={errorMessage} />

      <h2>Create New</h2>

      <form onSubmit={addBlog}>

        <div>
          title:
          <input
            type="text"
            value={newTitle}
            name="Title"
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>

        <div>
          author:
          <input
            type="text"
            value={newAuthor}
            name='Author'
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>

        <div>
          url:
          <input
            type="text"
            value={newUrl}
            name='Url'
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>

        <button type="submit">Create</button>

      </form>
      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

}


export default App