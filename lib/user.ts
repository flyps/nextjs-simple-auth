import crypto from "crypto";
import { ensureConnection } from "db/datasource";
import { User } from "db/user";

require("db/datasource");

interface FindUser {
  email: string;
}

interface CreateUser {
  email: string;
  password: string;
}

export async function createUser({ email, password }: CreateUser) {
  await ensureConnection();

  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  const user = new User();
  user.email = email;
  user.hash = hash;
  user.salt = salt;
  await user.save();

  return { email, createdAt: Date.now() };
}

export async function findUser({ email }: FindUser) {
  await ensureConnection();

  return await User.findOneBy({ email });
}

// Compare the password of an already fetched user (using `findUser`) and compare the
// password for a potential match
export function validatePassword(user: User, inputPassword: string) {
  console.log("Validating", user);
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, "sha512")
    .toString("hex");
  const passwordsMatch = user.hash === inputHash;
  return passwordsMatch;
}
