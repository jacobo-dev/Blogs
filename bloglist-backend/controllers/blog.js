const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
      const blogs = await Blog.find({})
        response.json(blogs)
      })

  
  blogsRouter.post('/', async(request, response) => {
    const body = request.body

    if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = request.user


    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })
    const savedBlog = await blog.save()
    
    
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

      response.status(200).json(savedBlog)
  })

  blogsRouter.delete('/:id', async(request, response) => {
    
    if (!request.user) {
      return response.status(401).json({ error: 'token invalid' })
    }

  const userid = request.user.id
  const blog = await Blog.findById(request.params.id)

  
    if (blog.user.toString() === userid.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    }else{
      return response.status(401).json({ error: 'token invalid' })
    }
  
  })

  blogsRouter.put('/:id', async(request, response) => {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
  }

    const updateBlog =  await Blog.findByIdAndUpdate(request.params.id, blog, {new : true})
     response.json(updateBlog)
  })
  
  module.exports = blogsRouter