import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function signup(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Name, email, and a password of 8+ characters are required' });
  }
  if (await User.findByEmail(email)) return res.status(409).json({ error: 'An account with that email already exists' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  res.status(201).json({ user, token: createToken(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findByEmail(email || '');
  if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {
    return res.status(401).json({ error: 'Email or password is incorrect' });
  }
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token: createToken(user) });
}