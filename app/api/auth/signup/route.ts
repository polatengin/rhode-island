import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/schemas/db";
import { users } from "@/schemas/drizzle";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

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

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      organization_id: "1", // You might want to adjust this based on your needs
    }).returning();

    // Return success but don't include the password
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
