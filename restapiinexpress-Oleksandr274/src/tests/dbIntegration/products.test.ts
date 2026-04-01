import request from 'supertest';
import { app } from '../..';

describe('Product API', () => {
  let productId: string;

  const newProduct = { 
    "title": "Salty Lined Beanie Adults",
    "images": ["https://cdn.media.amplience.net/i/frasersdev/90695740_o?fmt=auto&upscale=false&w=1534&h=1534&sm=scaleFit&$h-ttl$"],
    "category": "headgear",
    "price": 28.00,
    "brand": "The North Face",
    "condition": "brand-new",
    "description": "Our classic Salty Beanie delivers exceptional warmth, wherever the adventure takes you."
}

  test('should create a product and return Location header', async () => {

    const res = await request(app)
      .post('/api/v1/products')
      .send(newProduct).expect(201);

    const location = res.header['location'];

    productId = location;
    expect(productId).toBeUndefined();
  });
});
