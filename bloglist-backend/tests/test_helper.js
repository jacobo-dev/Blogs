const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Jesus esta aqui',
        author: 'Dios',
        url: 'ww.dios.com',
        likes: 3
    }
]

const blogExistingId = async () => {
    const blog = new Blog({ content: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()
  
    return note._id.toString()
  }
  
  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

const initialUsers = [
    {
        username: 'Dios',
        name: 'Jesus Maria',
        password: 'diosmio',
    }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
    initialBlogs, blogExistingId, blogsInDb, initialUsers, usersInDb
}