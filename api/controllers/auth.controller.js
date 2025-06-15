import { errorHandler } from "../utils/error.js"
import passport from "passport"
import express from "express";
import jwt from "jsonwebtoken";


export const git = (req,res) => {
    res.json({
        message: 'test',
    })
}

export const github_callback = async (req, res, next) => {
    try {
        const token = jwt.sign({ id: req.user.id,login: req.user.login, username: req.user.username,avatar_url: req.user.avatar_url,
      email: req.user.email,name: req.user.name,accessToken: req.user.accessToken, }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('access_token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000,
        });
        res.redirect(`${process.env.FRONTEND_URL}/home`);
    } catch (error) {
        if (!res.headersSent) next(error);
    }
}


export const home = (req,res) => {
    res.send(req.body);
}



export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json({ success: true, message: 'User signed out successfully' });
    } catch (error) {
        if (!res.headersSent) next(error);
    }
    
}

// export const getUserProfile = async (req, res, next) => {
//   try {
//     const { username, avatar_url, email, name } = req.user;

//     res.status(200).json({
//       login: username,
//       avatar_url,
//       email,
//       name,
//     });
//   } catch (error) {
//     next({
//       statusCode: 500,
//       message: 'Error retrieving user profile',
//     });
//   }
// };
export const getUserProfile = async (req, res, next) => {
  try {
    const { login, avatar_url, email, name } = req.user;

    res.status(200).json({
      login,
      avatar_url,
      email,
      name,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Error retrieving user profile',
    });
  }
};
