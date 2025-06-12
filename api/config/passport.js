import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from "dotenv";
dotenv.config();

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/github/callback"
},
(accessToken, refreshToken, profile, done) => {

  if (!accessToken) {
    return done(new Error("Failed to obtain access token"));
  }
  profile.accessToken = accessToken;
  return done(null, profile);
}
));

/*
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
*/