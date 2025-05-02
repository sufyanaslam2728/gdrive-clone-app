import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/typeorm";
import Folder from "@/entities/Folder";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name } = await request.json();
    const dataSource = await getDataSource();
    const folderRepo = dataSource.getRepository(Folder);
    await folderRepo.update(id, { name });

    return NextResponse.json({ message: "Folder updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error Updating folder." },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const dataSource = await getDataSource();
    const folderRepo = dataSource.getRepository(Folder);

    const folder = await folderRepo.findOne({ where: { id: parseInt(id) } });
    if (!folder) {
      return NextResponse.json(
        { message: "Folder not found." },
        { status: 404 }
      );
    }

    const childCount = await folderRepo.count({
      where: { parent: { id: folder.id } },
    });
    if (childCount > 0) {
      return NextResponse.json(
        { message: "Folder has subfolders and cannot be deleted." },
        { status: 400 }
      );
    }

    await folderRepo.remove(folder);

    return NextResponse.json(
      { message: "Folder deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting folder." },
      { status: 500 }
    );
  }
}
