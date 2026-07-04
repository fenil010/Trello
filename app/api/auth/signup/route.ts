import { NextRequest, NextResponse } from "next/server";
import { signupShcema } from "@/lib/validator";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const valid = signupShcema.safeParse(body);

    if (!valid.success) {
      return NextResponse.json(
        { error: valid.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, password } = valid.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "email already registered" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "user created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "invalid server error",
      },
      { status: 500 },
    );
  }
}
