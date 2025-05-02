import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/typeorm";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { name, email, password } = await req.json();

  const db = await getDataSource();
  const userRepo = db.getRepository("User");

  const existingUser = await userRepo.findOneBy({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userRepo.create({ name, email, password: hashedPassword });
  await userRepo.save(user);

  return NextResponse.json(
    { message: "User registered successfully" },
    { status: 201 }
  );
}
