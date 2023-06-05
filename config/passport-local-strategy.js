// required library
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); 
const User = require('../models/user');


// authentication using passport
// passport.use(new LocalStrategy({
//         usernameField: 'email',
        
//         passReqToCallback: true
//     },
//     function(req, email, password, done){
//         // find a user and establish the identity
//         User.findOne({email: email}, function(err, user)  {
//             if (err){
//                 req.flash('error', err);
//                 return done(err);
//             }

//             if (!user || user.password != password){
//                 console.log(password+"ss"+user.password,user)
//                 req.flash('error', 'Invalid Username/Password');
//                 return done(null, false);
//             }
           
//             bcrypt.compare(password,user.password,(err,res)=>{
//                 if (!res) {
//                     console.log("invalid username password");
//                     return done(null, false)
//                 }
//                 if(err){
//                     console.log(err,"error in bcrypt");
//                     return done(null, false)
//                 }
//             })

//             return done(null, user);
//         });
//     }


// ));

// Configure the local strategy with a custom verify function
const localStrategy = new LocalStrategy({usernameField: 'email',passwordField: 'password',passReqToCallback: true},async (req,email, password, done) => {
    try {
      // Find the user with the given username
      const user = await User.findOne({ email });
  
      // If the user does not exist, return an error
      if (!user) {
        req.flash('error', 'User not found');
        console.log('User not found');
        return done(null, false, { message: 'Incorrect email' });
      }

      
      //decrypt and check password from stored one
      const passwordMatches = await bcrypt.compare(password, user.password);

  
      //verify password
      if (!passwordMatches) {
        req.flash('error', 'Invalid password');
        console.log('Invalid password');
        return done(null, false);
      }
      
  
      // Otherwise, return the user object
      
      return done(null, user);
      
    } catch (err) {
        console.log('Error while authenticating user');
      return done(err);
    }
  });
// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}



module.exports = localStrategy;