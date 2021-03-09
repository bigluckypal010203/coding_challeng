import Joi from "joi";
import { Request, Response, NextFunction, response } from "express";

import logger from "../../../utils/logger";
import { getUserByUsernameAndEmail } from "./user.controller";
import UserError from "./user.error";


const bluePrintUser = Joi.object().keys({
  username: Joi.string().max(50).min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(50).required(),
});

export const valideteUserInfo = (req: Request, res: Response, next: NextFunction) => {
  const validatedInfo = bluePrintUser.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (validatedInfo.error != undefined) {
    const errors = validatedInfo.error.details.reduce((acumulator, error) => {
      return acumulator + error.message;
    }, "");

    const messageError = `Wrong information please check and try again ${errors}`;
    logger.warn(messageError);
    throw new UserError(messageError, "Validation User Error");
  }
  logger.info(`New user send a valid information for registration.`);
  next();
};

export const checkUserAvailableInDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserByUsernameAndEmail(
      req.body.username,
      req.body.email
    );

    if (user) {
      logger.warn(
        `Already exists user with username:${user.username} and email: ${user.email}`
      );
      return next(new UserError(`Already exists user with username and email`, "Validation User Error"))
    }
    logger.info(`User credential are free`);
    next();
  } catch (error) {
    logger.error(
      `Error ocurried checking if user exists in data base ${error}`
    );
    throw new UserError("Internal server error in register process", "Validation User Error");
  }
};

export const convertToLowerCase = (req: Request, res: Response, next: NextFunction) => {

  const emailLowerCase = req.body.email;
  req.body.email = emailLowerCase.toLowerCase();
  logger.info(
    `Email: ${req.body.email}  to lowerCase emailLC:${emailLowerCase} `
  );
  return next();
};

export const checkUserRegister = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const user = await getUserByUsernameAndEmail(
      "",
      req.body.email,
    );
    if (user) {
      logger.info(
        `User with username:${user.username} and email: ${user.email} is register`
      );

      return next();
    }
    logger.warn(
      `${req.body.email} is not register`
    );
    return next(new UserError(`${req.body.email} is not registered`, "Validation User Error"));

  } catch (error) {
    logger.error(
      `Error ocurried checking if user exists in data base ${error}`
    );
    throw new UserError("Internal server error in UCH", "Validation User Error");

  }
};
