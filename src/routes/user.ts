
import express from "express";
import { body } from "express-validator";


import {
  deactivateUser,
  getUser,
  updateUser,
  changePassword,
  verifyDeactivateAccountOTP,
} from "../controllers/user";

import { logOut } from "../controllers/blacklistedToken";
import { isAuthenticated } from "../middlewares/auth";
import { isPasswordValid } from "../controllers/auth";
import { validateRequest } from "../helper/validateRequest";

const router = express.Router();

//Get /user/:userId
router.get("/", isAuthenticated, getUser);

//Put /user/
router.put("/", isAuthenticated, updateUser);

//PATCH /user/deactivate
router.patch("/deactivate", isAuthenticated, deactivateUser);

// POST -> /user/deactivate/verify-deactivate-account-otp
router.post("/deactivate/verify-deactivate-account-otp", isAuthenticated, verifyDeactivateAccountOTP);

//Put  /user/changepassword
router.put(
  "/changepassword",
  isAuthenticated,
  [
    body("newPassword")
      .trim()
      .isLength({ min: 8 })
      .custom((password: String) => {
        return isPasswordValid(password)
          .then((status: Boolean) => {
            if (!status)
              return Promise.reject(
                "Enter a valid password, having atleast 8 characters including 1 small alphabet, 1 capital albhabet, 1 digit and 1 special character($,@,!,#,*)."
              );
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }),
  ],
  validateRequest,
  changePassword
);

// POST /user/logout
router.post("/logout", isAuthenticated, logOut);

export default router;