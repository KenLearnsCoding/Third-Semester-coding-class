const express = require('express');
const crypto = require('crypto');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

function AuthRouter(database) {
    // Router Setup
    var router = express.Router();

    // Session Middleware Setup
    router.use(
        session({
            secret: '6KStenGQgjCf',
            resave: false,
            saveUninitialized: false
        })
    );

    // Passport Authentication Setup
    router.use(passport.authenticate('session'));

    // User Data Middleware
    router.use((req, res, next) => {
        if(req.user) {
            res.locals.user = req.user;
        }
        next();
    });

    // Local Strategy Setup
    passport.use(
      new LocalStrategy(
        async function verify(username, password, callback) {
            let foundUser = await database.collections.users.findOne({ username: username }).catch((error) => {
                if(error) {
                    callback("Incorrect username or password". null);
                }
            });
            if(!foundUser) {
                callback("Incorrect username or password". null);
                return;
            }
            crypto.pbkdf2(password, foundUser.salt, 310000, 32, 'sha256', function(_, hashedPassword) {
                if (foundUser.password !== hashedPassword.toString('hex')) {
                    callback("Incorrect username or password");
                    return;
                }
                return callback(null, foundUser);
            });
        }
      )
    );

    // Serialize and Deserialize User Setup
    // These functions define how Passport should serialize and deserialize user objects
    // Serialization refers to the process of converting a user object into a format that can be stored, typically in a cookie or a session.
    // 
    passport.serializeUser(function(user, callback) {
        return callback(null, {id: user.id, username: user.username});
    });
    // Deserialization is the process of taking the stored identifier (such as a user ID) and turning it back into a user object.
    passport.deserializeUser(function(user, callback) {
        return callback(null, user);
    });

    // Routes for Register and Login
    router.get('/register', (req, res) => {
        const style = "../css/register.css";
        res.render('auth/register', {errorMessage: null });
    });
    
    router.get('/login', (req, res) => {
        const style = "../css/login.css";
        res.render('auth/login', { errorMessage: null, style: style });
    });

    // this is check img url valid or not for register page.
    // i tried to use diff way from this sha 256, but its interesting when i test on mongodb collection.
    // Therefore i keep the password hash and salt in the database.
    router.post('/register', async (req, res) => {
        const data = req.body;
        const imageUrl = data.url;
            try {
                
                // Validate the image URL
                const response = await fetch(imageUrl);
                if (!response.ok) {
                    console.log("Image URL is invalid");
                    res.render('auth/register', { errorMessage: "There was an issue checking the URL" });
                    return;
                }
        
                // Validate other form fields
                if (Object.keys(data).length <= 0 || (!data.firstname || !data.lastname || !data.email || !data.password || !data.username)) {
                    res.render('auth/register', { error: "Please enter all fields" });
                    return;
                }
        
                console.log(data);
                const salt = crypto.randomBytes(16).toString('hex');
                const hashedPassword = await new Promise((resolve, _) => {
                    crypto.pbkdf2(data.password, salt, 310000, 32,'sha256', (_, hashedPassword) => {
                        resolve(hashedPassword);
                    });
                });
           
                // i dont use ..data because i get familiar with this way below 
                console.log(hashedPassword.toString('hex'));
                let user = await database.collections.users.insertOne({
                    ...data,
                    password: hashedPassword.toString('hex'),
                    salt: salt
                });

                console.log('User inserted:', user);

                await new Promise((resolve, _) => {
                    req.login({
                        id: user.insertedId.toString(),
                        username: data.username
                    }, () => {
                        console.log('User logged in:', req.user); // Log the user information
                        resolve();
                    });
                });
        
                res.redirect('/');
            } catch (error) {
                // Handle errors, for example, render an error page
                console.error('Error during registration:', error);
                return res.render('auth/register', { errorMessage: 'An error occurred during registration.' });
            }
    });

    router.get('/', (req, res) => {
        res.render('partials/navigation', { user: req.user });
    });

    router.post('/login', (req, res, next) => {
        passport.authenticate('local', async(error, user) => {  // This is a function that we are calling on line where we are ending the brackets.
            await new Promise((resolve, _) => {
                req.login({
                    id: user._id.toString(),
                    username: user.username
                }, () => {
                    resolve();
                });
            });
            res.redirect('/');
        })(req, res, next);
    });


    // Logout Route
    router.get('/logout', (req, res, next) => {
        req.logout(function(error) {
            if (error) {
                next(error);
                return;
            }
            res.redirect('/');
        });
    });

    // Return the Configured Router: Exports the configured router for use in other parts of the application.
    return router;
}

module.exports = AuthRouter;