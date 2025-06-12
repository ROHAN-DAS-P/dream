// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Core dependencies
import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';


// Authentication dependencies
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';

// For making HTTP requests
import axios from 'axios';

import userRouter from "./routes/auth.route.js"
import repoRouter from "./routes/repo.route.js"

import './config/passport.js';




const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(passport.initialize());


app.use("/api/auth", userRouter);
app.use('/api/repo', repoRouter);



app.use((err, req, res, next) => {
  if (res.headersSent) {
    // If headers already sent, let Express handle the error
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
    }
)