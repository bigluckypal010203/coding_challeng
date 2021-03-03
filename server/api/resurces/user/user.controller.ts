import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserModel } from "./user.model";
import { config } from "../../../config/index";
import logger from "../../../utils/logger";
import { v4 as uuidv4 } from 'uuid';

const users: UserModel[] = [];

const hashPassword = (password: string) => {
  logger.info("Hasing passwrod");
  const hashedPassword: string = bcrypt.hashSync(
    password,
    parseInt(config.bcrypt.saltOrRouds)
  );
  return hashedPassword;
}

const getTimeStamp = () => {
  return new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
}

export const getUserByUsernameAndEmail = (
  username: string | undefined,
  email: string | undefined
) => {
  return users.find((item: UserModel) =>
    item.email === email || item.username === username
  );
};

export const saveUser = (username: string, email: string, password: string) => {
  const user: UserModel = {
    _id: uuidv4(),
    email,
    password: hashPassword(password),
    username,
    created_at: getTimeStamp()
  }
  users.push(user);
  return user;
};

export const hideCriticalInformation = (user: UserModel) => {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    created_at: user.created_at,
  };
};

export const createToken = (_id: string) => {
  logger.info("Creating token");
  const token = jwt.sign({ _id }, config.jwt.secretOrKey, {
    expiresIn: config.jwt.expiresIn,
  });
  logger.info(`token created successfully ${token}`);
  return token;
};

export const getUserById = (_id: string | undefined) => {
  
  return users.find((item: UserModel) => item._id === _id);
};

export const validatePassword = (user: UserModel, password: string) => {
  logger.info("Compare password with database");
  return bcrypt.compareSync(password, user.password);
};
