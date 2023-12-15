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

    // line 27-61 are the routes of the pages for non-registered or non-sign in users
    router.get('/', async (req, res) => {
        const style = "css/home.css";
        res.render('home', { title: 'Home', style: style } );
    
    });
    
    router.get('/purchase', async (re, res) => {
        const style = "css/purchase.css";
        const total_amount_buy = '';
        res.render('purchase', {
            title: 'Purchase', 
            price: 'price', 
            style: style, 
            totalBuy: total_amount_buy
        });
    
    });
    
    router.get('/market', async (re, res) => {
        const style = "./css/market.css";
        res.render('market', {title: 'Market', style: style});
    });
    
    router.get('/learn', async (re, res) => {
        const style = "./css/learn.css";
        const coin = "";
        const coin_explanation = "";
        res.render('learn', {
            title: 'Learn',
            coin: coin, 
            coin_explanation: coin_explanation, 
            style: style
        });
    });

    // router.get('/profile', async (re, res) => {
    //     const style = "css/profile.css";
    //     res.render('profile', {title: 'Dash Board', style: style});  
    // });

    // Routes for Register and Login
    router.get('/register', (req, res) => {
        res.render('auth/register', {errorMessage: null});
    });
    
    router.get('/login', (req, res) => {
        res.render('auth/login', {errorMessage: null});
    });

    // this is check img url valid or not for register page.
    // i tried to use diff way from this sha 256, but its interesting when i test on mongodb collection.
    // Therefore i keep the password hash and salt in the database.
    router.post('/register', async (req, res) => {
        let data = req.body;
        
        // Validate other form fields
        if (Object.keys(data).length <= 0 || (!data.firstname || !data.lastname || !data.email || !data.password || !data.username)) {
            res.render('auth/register', { errorMessage: "Please enter all fields" });
            return;
        }

        // Validate the image URL
        const imageUrl = data.url;

        // Check if the image URL is provided
        if (!imageUrl) {
            // If not provided, you may choose to handle it differently, e.g., proceed without checking the URL or display a message.
            console.log("Image URL not provided");
            data.url= '../assets/pics/2c80ydc.jpg'
        } else {
            try {
                const response = await fetch(imageUrl);

                if (!response.ok) {
                    console.log("Image URL is invalid");
                    res.render('auth/register', { errorMessage: "There was an issue checking the URL" });
                    return;
                }
            } catch (error) {
                console.error("Error checking image URL:", error);
                res.render('auth/register', { errorMessage: "There was an issue checking the URL" });
                return;
            }
        }

        console.log(data);
        // the input password will be reversed to hash password and salt by using crypto
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await new Promise((resolve, _) => {
            crypto.pbkdf2(data.password, salt, 310000, 32,'sha256', (_, hashedPassword) => {
                resolve(hashedPassword);
            });
        });
    
        //  '..data' will take all input data from user in the register page
        console.log(hashedPassword.toString('hex'));
        let user = await database.collections.users.insertOne({
            ...data,
            password: hashedPassword.toString('hex'),
            salt: salt
        });

        // this block below is to keep the user login after register
        console.log('User inserted:', user);
        await new Promise((resolve, _) => {
            req.login({
                id: user.insertedId.toString(),
                username: data.username
            }, () => {
                console.log('User logged in:', res.locals.user ); // Log the user information
                resolve();
            });
        });
        res.redirect('/');
    });

    // this post is to get action from login page. 
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', async(error, user) => {
            // verify password and username
            if (!user) {
                // Authentication failed
                console.error('Login failed:', error);
                res.render('auth/login', { errorMessage: 'Incorrect username or password' });
                return;
            }
            console.log('User logged in successfully');
            // keep the user login after login
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
    router.get('/logout', (req, res) => {
        req.logout((error) => {
            if (error) {
                // Handle error
                console.error('Logout failed:', error);
                res.status(500).send('Logout failed');
            } else {
                // Redirect to the home page or any other desired page after logout
                res.redirect('/');
            }
        });
    });

    // Return the Configured Router: Exports the configured router for use in other parts of the application.
    return router;
}

module.exports = AuthRouter;