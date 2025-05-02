import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/typeorm";
import Folder from "@/entities/Folder";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const parentId = searchParams.get("parentId");

  try {
    const dataSource = await getDataSource();
    const folderRepo = dataSource.getRepository(Folder);
    const pid =
      parentId && parentId !== "null" && !isNaN(parseInt(parentId))
        ? parseInt(parentId)
        : null;

    const folders = await folderRepo
      .createQueryBuilder("folder")
      .leftJoinAndSelect("folder.parent", "parent")
      .leftJoin("folder.user", "user")
      .where("user.id = :userId", { userId })
      .andWhere(pid !== null ? "parent.id = :pid" : "folder.parentId IS NULL", {
        pid,
      })
      .getMany();

    return NextResponse.json(folders);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching folders" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { name, userId, parentId } = await req.json();

  if (!name || !userId) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    const dataSource = await getDataSource();
    const folderRepo = dataSource.getRepository(Folder);

    const newFolder = {
      name,
      user: { id: parseInt(userId) },
      ...(parentId && { parent: { id: parseInt(parentId) } }),
    };

    await folderRepo.save(newFolder);

    return NextResponse.json(
      { message: "Folder created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating folder" },
      { status: 500 }
    );
  }
}
