import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/typeorm";
import File from "@/entities/File";
import cloudinary from "@/lib/cloudinary";
export async function DELETE(req, { params }) {
  const { id } = await params;
  const db = await getDataSource();
  const fileRepo = db.getRepository(File);

  const file = await fileRepo.findOne({ where: { id: parseInt(id) } });
  if (!file)
    return NextResponse.json({ error: "File not found" }, { status: 404 });

  await cloudinary.uploader.destroy(file.cloudinaryId, {
    resource_type: file.resourceType,
  });

  await fileRepo.remove(file);
  return NextResponse.json({ success: true });
}
