import express from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import { git, home, github_callback, signOut, getUserProfile } from "../controllers/auth.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/git',git);
router.get('/', home);
router.get('/me', ensureAuth,getUserProfile);

router.get('/github', passport.authenticate('github', { scope: ['user', 'repo'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/', session: false }), github_callback);
router.post('/signout',signOut)




export default router;