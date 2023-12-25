import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth";
import examRoute from "./routes/exam";
import quizRoute from "./routes/quiz";
import reportRoute from "./routes/report";
import userRoute from "./routes/user";
import ProjectError from "./helper/error";
import { ReturnResponse } from "./utils/interfaces";
import clearBlacklistedTokenScheduler from "./utils/clearBlacklistedTokenScheduler";

dotenv.config();
const app = express();
app.use(
  cors({ origin: `http://${process.env.CORS_ORIGIN_URL}`, credentials: true })
);


const port = process.env.PORT;

app.use(express.json());
declare global {
  namespace Express {
    interface Request {
      userId: String;
    }
  }
}

//Redirect /auth
app.use("/auth", authRoute);

//Redirect /exam
app.use("/exam", examRoute);

//Redirect /quiz
app.use("/quiz", quizRoute);

//Redirect /report
app.use("/report", reportRoute);

//Redirect /user to userRoute
app.use("/user", userRoute);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("Server is working!");
});

app.use(
  (err: ProjectError, req: Request, res: Response, next: NextFunction) => {
    // logger for err
    let message: String;
    let statusCode: number;

    if (!!err.statusCode && err.statusCode < 500) {
      message = err.message;
      statusCode = err.statusCode;
    } else {
      message = "Something went wrong please try after sometime!";
      statusCode = 500;
    }

    let resp: ReturnResponse = { status: "error", message, data: {} };
    if (!!err.data) {
      resp.data = err.data;
    }

    console.log(err.statusCode, err.message);
    res.status(statusCode).send(resp);
  }
);

mongoose
  .connect(process.env.MONGODB_CONNECT || "")
  .then(() => {
    console.log("MongoDB is ready");

    app.listen(port, () => {
      console.log(`SERVER RUNNING : ${port}`);
    });
  })
  .catch((err: any) => {
    console.log(`MongoDB error: ${err}`);
  });
