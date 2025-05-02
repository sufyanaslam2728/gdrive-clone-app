import { EntitySchema } from "typeorm";

const Folder = new EntitySchema({
  name: "Folder",
  tableName: "folders",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
    },
  },
  relations: {
    parent: {
      type: "many-to-one",
      target: "Folder",
      joinColumn: { name: "parentId" },
      nullable: true,
      inverseSide: "children",
    },
    children: {
      type: "one-to-many",
      target: "Folder",
      inverseSide: "parent",
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      inverseSide: "folders",
    },
    files: {
      type: "one-to-many",
      target: "File",
      inverseSide: "folder",
    },
  },
});

export default Folder;
