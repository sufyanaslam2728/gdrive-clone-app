import { EntitySchema } from "typeorm";
import Folder from "./Folder.js";

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
  },
});

export default User;
