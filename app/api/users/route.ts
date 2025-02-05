import { users } from '@/schemas/drizzle';
import { getRequestContext } from '@cloudflare/next-on-pages'
import { drizzle } from 'drizzle-orm/d1';

export const runtime = 'edge'

export async function GET() {
  const { env } = getRequestContext();
  const db = drizzle(env.db);

  const userList = await db.select().from(users).all();

  return new Response(JSON.stringify(userList));
}

export async function POST(req: Request) {
  const { env } = getRequestContext();
  const db = drizzle(env.db);

  const { name } = await req.json() as { name: string };

  const id = await db.insert(users).values({
    organization_id: 1,
    name: `${name} ${Math.random()}`,
    created_at: new Date(),
    updated_at: new Date(),
  }).execute();

  return new Response(JSON.stringify({ id }), { status: 201 });
}
