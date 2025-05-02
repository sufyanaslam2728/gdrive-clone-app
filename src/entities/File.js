import { EntitySchema } from "typeorm";

const File = new EntitySchema({
  name: "File",
  tableName: "files",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    url: {
      type: "text",
    },
    cloudinaryId: {
      type: "varchar",
    },
    resourceType: {
      type: "varchar",
    },
  },
  relations: {
    folder: {
      type: "many-to-one",
      target: "Folder",
      joinColumn: true,
      nullable: true,
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      nullable: false,
    },
  },
});

export default File;
