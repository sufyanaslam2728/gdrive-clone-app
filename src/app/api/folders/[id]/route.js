import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/typeorm";
import Folder from "@/entities/Folder";
import File from "@/entities/File";

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
    const fileRepo = dataSource.getRepository(File);

    const folder = await folderRepo.findOne({ where: { id: parseInt(id) } });
    const fileCount = await fileRepo.count({
      where: { folder: { id: folder.id } },
    });
    if (!folder) {
      return NextResponse.json(
        { message: "Folder not found." },
        { status: 404 }
      );
    }

    const childCount = await folderRepo.count({
      where: { parent: { id: folder.id } },
    });
    if (fileCount > 0 || childCount > 0) {
      return NextResponse.json(
        {
          message:
            "Folder has subfolders and file due to which it cannot be deleted.",
        },
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
