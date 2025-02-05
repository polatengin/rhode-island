import { users } from '@/schemas/drizzle';
import { getRequestContext } from '@cloudflare/next-on-pages'
import { drizzle } from 'drizzle-orm/d1';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export const runtime = 'edge'

async function authenticate(req: Request) {
  const session = await getServerSession(authOptions);

  return !!session;
}

export async function GET(req: Request) {
  if (!await authenticate(req)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { env } = getRequestContext();
  const db = drizzle(env.db);

  const userList = await db.select().from(users).all();

  return new Response(JSON.stringify(userList));
}

export async function POST(req: Request) {
  if (!await authenticate(req)) {
    return new Response("Unauthorized", { status: 401 });
  }
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
