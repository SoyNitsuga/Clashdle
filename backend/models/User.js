import { sql } from "../db.js";
import bcrypt from "bcryptjs";

// Crear usuario
export async function createUser(username, password) {
  const hashed = await bcrypt.hash(password, 10);

  const [user] = await sql`
    INSERT INTO users (username, password)
    VALUES (${username}, ${hashed})
    RETURNING id, username, created_at;
  `;
  return user;
}

export async function findUserByUsername(username) {
  const [user] = await sql`SELECT * FROM users WHERE username = ${username}`;
  return user || null;
}

export async function validateUser(username, password) {
  const user = await findUserByUsername(username);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  return { id: user.id, username: user.username };
}