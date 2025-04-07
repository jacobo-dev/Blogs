const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')


beforeEach(async () => {
    await User.deleteMany({})
  
    let userObject = new User(helper.initialUsers[0])
    await userObject.save()
  })

test('user cant be added without username', async() => { 

    const newUser = {
        name: 'Jesus Maria',
        password: 'diosmio',
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb() 
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)

 })

test('user cant be added without username', async() => { 

    const newUser = {
        username: 'Dios',
        name: 'Jesus Maria',
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb() 
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)

 })

 test('minlength for username', async() => { 

    const newUser = {
        username: 'Di',
        name: 'Jesus Maria',
        password: 'diosmio'
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb() 
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)

 })
 



after(async () => {
  await mongoose.connection.close()
})
