import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
    },
  },
  relations: {
    folders: {
      type: "one-to-many",
      target: "Folder",
      inverseSide: "user",
    },
    files: {
      type: "one-to-many",
      target: "File",
      inverseSide: "user",
    },
  },
});

export default User;
