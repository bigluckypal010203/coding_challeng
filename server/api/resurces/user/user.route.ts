import { Router, Response, Request } from "express";
import passport from "passport";

import {
  saveUser,
  hideCriticalInformation,
  createToken,
  validatePassword,
  getUserByUsernameAndEmail,
  getUserById
} from "./user.controller";
import { UserModel } from "./user.model";
import {
  valideteUserInfo,
  checkUserAvailableInDB,
  convertToLowerCase,
  checkUserRegister,
} from "./user.validate";
import { errorHandler } from "../../libs/errorHandler";
import logger from "../../../utils/logger";
import UserError from "./user.error";

const userRouter = Router();
const jwtAuth = passport.authenticate("jwt", { session: false });

userRouter.post(
  "/signup",
  [valideteUserInfo, checkUserAvailableInDB],
  errorHandler(async (req: Request, res: Response) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    logger.info("User passed validation and will be create");
    const user = await saveUser(username, email, password);
    logger.info(
      `User witn username: ${user.username} was create successfully.`
    );
    const token = createToken(user._id);
    const userWithSafeInfo = hideCriticalInformation(user);
    logger.info(
      `User create successfully user: ${userWithSafeInfo.username}, and token: ${token}`
    );
    return res.status(201).json({
      user: userWithSafeInfo,
      token,
    });
  })
);

userRouter.post(
  "/login",
  [convertToLowerCase, checkUserRegister],
  errorHandler(async (req: Request, res: Response) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const user = await getUserByUsernameAndEmail(username, email);
    if (user && validatePassword(user, password)) {
      logger.info(
        `User with username:${user.username} send a valid password`
      );
      const token = createToken(user._id);
      const userWithSafeInfo = hideCriticalInformation(user);
      logger.info(
        `USer create token successfully user: ${userWithSafeInfo}, and token: ${token}`
      );
      return res.status(201).json({
        user: userWithSafeInfo,
        token,
      });
    } else if (!user) {
      logger.warn(
        `No such user exist`
      );
      throw new UserError(
        "No such user exist, please check and try again.",
        "User Error"
      );
    } else {
      logger.warn(
        `User with username${user.username} send a wrong password`
      );
      throw new UserError(
        "`Invalid password, please check and try again.",
        "User Error"
      );
    }
  })
);

userRouter.get("/whoami", [jwtAuth], errorHandler(async (req: Request, res: Response) => {

  const setUser: any = req.user;
  logger.info(`user from req: ${setUser?._id}`)
  const user = await getUserById(setUser?._id);
  logger.info(`User with need her information at route /whoami ${user}`);

  return res.status(200).json({
    user: user,
  })
}))


export default userRouter;
