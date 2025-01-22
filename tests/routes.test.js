const request = require('supertest');
const express = require('express');
const routes = require('../routes/routes');
const Character = require('./../models/Character')

// Mockeamos el modelo User
jest.mock('./../models/Character')

const app = express();
app.use(express.json());
app.use('/', routes);

describe('Routes Tests', () => {
  it('GET /characters should return the characters', async () => {
    const mockCharacters = [
      { name: 'Mortimer', email: 'morti@aeg.eus' },
      { name: 'Pazos el hacker', email: 'pazius@anonimous.com' },
    ];

    Character.find.mockResolvedValue(mockCharacters);

    const response = await request(app).get('/characters');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCharacters);
  });

});