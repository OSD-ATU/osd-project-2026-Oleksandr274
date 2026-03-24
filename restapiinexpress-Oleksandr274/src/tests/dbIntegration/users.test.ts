import request from 'supertest';
import { app } from '../..';

describe('User API', () => {
  let userId: string;

  const newUser = {
    "firstName": "Alex2",
    "lastName": "Ferguson2",
    "phonenumber": "+353871234567",
    "email": "alex2.ferguson@gmail.com",
    "password": "2password12345",
    "dob": "12-31-1941",
    "address": "The Manchester House2"
  }

  test('should create a user and return Location header', async () => {

    const res = await request(app)
      .post('/api/v1/users')
      .send(newUser).expect(201);

    const location = res.header['location'];

    userId = location;
    expect(userId).toBeDefined();
  });
});
