import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/typeorm";
import cloudinary from "@/lib/cloudinary";
import File from "@/entities/File";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const folderId = searchParams.get("folderId");
  const fid =
    folderId && folderId !== "null" && !isNaN(parseInt(folderId))
      ? parseInt(folderId)
      : null;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const dataSource = await getDataSource();
    const fileRepo = dataSource.getRepository(File);

    const files = await fileRepo
      .createQueryBuilder("file")
      .leftJoinAndSelect("file.folder", "folder")
      .where("file.userId = :userId", { userId })
      .andWhere(fid !== null ? "folder.id = :fid" : "file.folderId IS NULL", {
        fid,
      })
      .orderBy("file.id", "DESC")
      .getMany();

    return NextResponse.json(files);
  } catch (err) {
    console.error("[FILES_GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");
    const userId = data.get("userId");
    const folderId = data.get("folderId");
    const fid =
      folderId && folderId !== "null" && !isNaN(parseInt(folderId))
        ? parseInt(folderId)
        : null;

    if (!file || file.size > 64 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "drive-clone",
            resource_type: "auto",
            type: "upload",
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    const db = await getDataSource();
    const fileRepo = db.getRepository("File");

    const saved = await fileRepo.save({
      name: file.name,
      url: uploaded.url,
      cloudinaryId: uploaded.public_id,
      folder: fid ? { id: parseInt(fid) } : null,
      user: { id: parseInt(userId) },
      resourceType: uploaded.resource_type,
    });

    return NextResponse.json(
      { message: "File uploaded successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("What the hell is wrong: ", error);
    return NextResponse.json(
      { message: "Error uploading file" },
      { status: 500 }
    );
  }
}
