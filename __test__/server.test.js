'use strict';

require ('dotenv').config();
const { db } = require('../src/models/index');
const supertest = require('supertest');
const { server } = require('../src/server.js');
const mockRequest = supertest(server);

const SECRET=process.env.SECRET || "anas";





let userInfo = {
  testUser: { username: 'user', password: 'password', role: 'admin' },
};
let token = null;

beforeAll(async () => {
  await db.sync();
});


describe('auth api', () => {

  it('creates a new user and sends an object with the user and the token to the client', async () => {
    const response = await mockRequest.post('/signup').send(userInfo.testUser);
    expect(response.status).toBe(201);
  });

  it('Can signin with basic auth string', async () => {
    let { username, password } = userInfo.testUser;
    const response = await mockRequest.post('/signin')
      .auth(username, password);
    expect(response.status).toBe(200);
  });

  it('signin with basic authentication', async () => {
    let { username, password } = userInfo.testUser;
    const response = await mockRequest.post('/signin')
      .auth(username, password);
    token = response.body.token;
    const bearerResponse = await mockRequest
      .get('/secret')
      .set('Authorization', `Bearer ${token}`);
    expect(bearerResponse.status).toBe(200);
  });

  it('adds an item to the DB ', async () => {
    const response = await mockRequest.post('/api/v1/clothes').send({
      name: 'anas',
      color: 'red',
      size: '56'
    });
    expect(response.status).toBe(201);
  });
  it('returns a list of :model items', async () => {
    const response = await mockRequest.get('/api/v1/clothes');
    expect(response.status).toBe(200);

  });
  it('returns a single item by ID', async () => {
    const response = await mockRequest.get('/api/v1/clothes/1');
    expect(response.status).toBe(200);
  });
  it('updated item by ID', async () => {
    const response = await mockRequest.put('/api/v1/clothes/1');
    expect(response.status).toBe(201);
  });
  it('delete item', async () => {
    const response = await mockRequest.delete('/api/v1/clothes/1');
    expect(response.status).toBe(204);
  });
  it('can add a clothes item', async () => {
    const response = await mockRequest.post('/api/v2/clothes').set('Authorization', `Bearer ${token}`).send({
      name: 'anas',
      color: 'blue',
      size: '56'
    });
    expect(response.status).toBe(201);
  });
  
  it('adds an item to the DB', async () => {
    const response = await mockRequest.get('/api/v2/clothes').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it('returns a list of :model items', async () => {
    const response = await mockRequest.get('/api/v2/clothes').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it('returns a single item by ID', async () => {
    const response = await mockRequest.get('/api/v2/clothes/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it('updated item by ID', async () => {
    const response = await mockRequest.put('/api/v2/clothes/1').set('Authorization', `Bearer ${token}`).send({
      name: 'anas2',
      color: 'green',
      size: '56'
      });
    expect(response.status).toBe(201);
  });
  it('delete item', async () => {
    const response = await mockRequest.delete('/api/v2/clothes/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });
});

afterAll(async () => {
  await db.drop();
});
