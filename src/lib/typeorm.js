import { DataSource } from "typeorm";
import User from "@/entities/User";
import Folder from "@/entities/Folder";
import File from "@/entities/File";

let dataSource;

export async function getDataSource() {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [User, Folder, File],
  });

  await dataSource.initialize();

  console.log("✅ Connected to PostgreSQL");

  return dataSource;
}
