const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  
  const user = new User(helper.initialUsers[0])
  await user.save()

  // 🔵 Asignar usuario al blog
  const blog = new Blog({ ...helper.initialBlogs[0], user: user._id })
  await blog.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('id prove', async() => { 
        const response  = await api.get('/api/blogs')
        
         assert.strictEqual(response.body[0]._id, undefined)
 })

 test('blog can be added', async() => {

    const user= await User.findOne({username: "Dios" })
    
    const userToken ={
      username: user.username,
      id: user.id
    }

    const token = jwt.sign(userToken, process.env.SECRET )

    const newBlog = {
        title: 'Maria esta aqui',
        author: 'Maria',
        url: 'ww.maria.com',
        likes: 8,
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length +1)
 })

 test('blog can be added without likes', async() => {

  const user= await User.findOne({username: "Dios" })
    
  const userToken ={
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userToken, process.env.SECRET )

    const newBlog = {
        title: 'Maria esta aqui',
        author: 'Maria',
        url: 'ww.maria.com',
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length +1)

 })
 test('blog cantbe added without url or Title', async() => {

  const user= await User.findOne({username: "Dios" })
    
  const userToken ={
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userToken, process.env.SECRET )


    const newBlog = {
        author: 'Maria',
        url: 'ww.maria.com',
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

 })
 test('blog can be deleted', async() => {

  const user= await User.findOne({username: "Dios" })

  const userToken ={
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userToken, process.env.SECRET )

    const blogsAtStart = await helper.blogsInDb()
    const blogDele = blogsAtStart[0]

    await api
    .delete(`/api/blogs/${blogDele.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length-1)

 })

 test('blog can be updated', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogUpd = blogsAtStart[0]

    const updateBlog = {
        author: 'Maria',
        url: 'ww.maria.com',
    }

    await api
    .put(`/api/blogs/${blogUpd.id}`)
    .send(updateBlog)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const contents = blogsAtEnd.map(b => b.author)
    console.log(blogsAtEnd);
    
    assert(contents.includes('Maria'))

 })
 

after(async () => {
  await mongoose.connection.close()
})

