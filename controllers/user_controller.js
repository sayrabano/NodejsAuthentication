// required library/module
const User = require('../models/user');
const bcrypt = require('bcrypt');



// function to renderSignIn page
module.exports.renderSignIn = function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/home');
    }
    return res.render('user_sign_in', { title: 'Sign In' });
}
// function to renderSignUp page
module.exports.renderSignUp = function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/home');
    }
    return res.render('user_sign_up', { title: 'Sign Up' });

}
// function to renderProfile page
module.exports.renderHome = function (req, res) {
    return res.render('user_profile', { title: 'Profile Page', user: req.user });
}

// function to renderresetPassword page
module.exports.renderResetPassword = function(req,res){
    return res.render('reset',{title:'Reset Password', user: req.user});
}

//// function to update password
module.exports.updatePassword = async function(req,res){
    try{
        // finding user
        const user = await User.findOne({email:req.body.email});
        //match current password
        const passwordMatches = await bcrypt.compare(req.body.password, user.password);
        if(!passwordMatches){
            return res.redirect('back');
        }
        
        // bycrptting password
        const plaintextPassword = req.body.new_password;
        const saltRounds = 10;
        const hash = await bcrypt.hash(plaintextPassword, saltRounds);
        user.password = hash;
        await user.save();
        return res.redirect('/home');

    }
    catch(e){
        console.log('Error in reseting password: ',e);
    }

}


// function to create user in db
module.exports.create = async function (req, res) {

    try {

        if (req.body.password != req.body.confirm_password) {
            //notification that password don't match and redirect to sign Up
            req.flash('error', 'Passwords do not match');
            return res.redirect('back');
        }

        //check if user already exist
        const user = await User.findOne({email:req.body.email});
        if(user){
             // notification to check if user is exist or not
            req.flash('error', 'User already exist');
               
            return res.redirect('back');
        }

        const plaintextPassword = req.body.password;
        const saltRounds = 10;

        const hash = await bcrypt.hash(plaintextPassword, saltRounds);


        // creating user obj
        const newUser = await new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        // save the new user to the database
        const savedUser = await newUser.save();
         // notification after signup
        req.flash('success', 'You have signed up, login to continue!');
        return res.redirect('/');

    }
    catch (e) {
        console.log('Error in creating user: ',e);
        return res.redirect('back');
    }

}


// dunction to create session after login
module.exports.createSession = function (req, res) {
     // notification after login
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/home');
}

// function to destroy session/logout
module.exports.destroySession = function (req, res) {

    req.logout(function (err) {
        if (err) {
            console.log('Error in logging out :', err);
        }
         
        console.log("logged out");
        // notification after logout
        req.flash('success', 'User logout sucessfully');

        return res.redirect('/');
    })

}