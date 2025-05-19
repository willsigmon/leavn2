import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { registerRoutes } from '../routes';
import request from 'supertest';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

await registerRoutes(app);

test('lowercase book name returns cross references', async () => {
  const res = await request(app).get('/api/reader/cross-references/genesis/1/1');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length > 0);
});
