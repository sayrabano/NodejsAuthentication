// required library
const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_controller');
const passport = require('passport');

// routing 
router.get('/',controller.renderSignIn);
router.get('/sign-up',controller.renderSignUp);
router.post('/create',controller.create);
router.post('/create-session',passport.authenticate('local',{failureRedirect: '/'}),controller.createSession);
router.get('/home', passport.checkAuthentication, controller.renderHome);
router.get('/destroy-session',controller.destroySession);
router.get('/reset-password',controller.renderResetPassword);
router.post('/update-password',passport.authenticate('local',{failureRedirect:'back'}),controller.updatePassword);

// Define routes for Google authentication
router.get('/users/auth/google', passport.authenticate('google',{scope:['profile','email']}));

//callback from google
router.get('/users/auth/google/callback', passport.authenticate('google',{failureRedirect:'/'}), controller.createSession);



module.exports = router;