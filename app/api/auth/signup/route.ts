import { NextResponse } from "next/server";
import { db } from "@/schemas/db";
import { users } from "@/schemas/drizzle";
import { hashPassword } from "@/lib/auth/password";

export const runtime = 'edge';

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = (await request.json()) as SignupRequest;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password using our custom implementation
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      organization_id: 1, // Default organization ID
    }).returning();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error in signup:", error);
    return NextResponse.json(
      { error: "An error occurred while creating your account" },
      { status: 500 }
    );
  }
}
