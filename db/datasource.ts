import { DataSource } from "typeorm";
import { User } from "./user";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "app.db",
  entities: [User],
  synchronize: true,
});

export const ensureConnection = async () => {
  if (AppDataSource.isInitialized) return;
  await AppDataSource.initialize();
};
