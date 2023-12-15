const DatabaseService = require('../database/database.js');
const express = require('express');
const helpers = require('../helpers/auth.js');

function ArticleRouter(database) {
    var router = express.Router();
    // I dont want to use this render function in the auth.js file. Because this route cant access to the article collection from 
    // auth.js file. Also if i put this profile router in ath.js and this file, it will be a conflict. 
    // There for i will call the render profile here. 
    // this show up the users' all article on the profile page. 
    router.get('/profile', helpers.isAuthenticated, async (req, res) => {
        const style = "css/profile.css";

        // Fetch user information
        const userInformation = await database.collections.users.findOne(
            { _id: new DatabaseService.ObjectId(req.user.id) }
        );

        // Fetch articles associated with the user
        const userArticles = await database.collections.articles.find({ authorID: req.user.id }).toArray();
        console.log(userInformation)


        res.render('profile', {
            title: 'Dashboard',
            style: style,
            user: userInformation,
            articles: userArticles  // Pass the user's articles to the view
        });
    });

    // Rendering the main view where all the articles are shown
    router.get('/article', async (req, res) => {
        // Fetch all the articles from the database
        let articlesData = await database.collections.articles.find({}).toArray();

        // Fetch user information for each article author
        const articlesWithUsers = await Promise.all(articlesData.map(async article => {
            const userInformation = await database.collections.users.findOne(
                { _id: new DatabaseService.ObjectId(article.authorID) },
                { projection: { firstname: 1, lastname: 1, url: 1 } }
            );
            // in case the user is deleted, we will show the default profile image.
            // Check if userInformation is not null before assigning it to the author property
            const author = userInformation ? userInformation : { 
                firstname: 'Unknown', 
                lastname: 'Author', 
                url: "none"
            };
            
            return { ...article, author: author };
        }));

        // Render the 'articles' view with the articlesWithUsers variable
        res.render('articles/articles.ejs', { articlesWithUsers: articlesWithUsers });
    });

    router.get('/publicArticle', helpers.isAuthenticated, (req, res) => {
        res.render('articles/write.ejs', { error: null });
    });

    // Create a new article
    router.post('/publicArticle', helpers.isAuthenticated, async (req, res) => {
        let data = req.body;

        // Add the author's user ID to the article collections
        // This way it's easier to fetch article data belonging to respective users. 
        data.authorID = req.user.id;
        console.log('Author ID:', data.authorID);

        // If the data passed in doesn't match what's expected, render the new article view again with an error to display
        if (Object.keys(data).length <= 0 || (!data.title || !data.content)) {
            res.render('articles/write.ejs', { error: "There was an issue creating the article." });
            return;
        }

        console.log(data);

        // Insert article into the database
        const result = await database.collections.articles.insertOne(data);
        console.log('Article inserted successfully');
        const insertedArticleId = result.insertedId.toString();
        console.log('Article inserted successfully with ID:', insertedArticleId);

        // Once the article is created, redirect to the article detail page
        res.redirect(`/articles/${insertedArticleId}`);
    });


    // Rendering the existing article view
    router.get('/articles/:id', async (req, res) => {
        const articleId = req.params.id;

        // Fetch the article data from the database using the articleId
        const article = await database.collections.articles.findOne({ _id: new DatabaseService.ObjectId(articleId) });

        if (!article) {
            // If the article is not found, you might want to handle this case
            res.status(404).send('Article not found');
            return;
        }

        // Fetch user information for the article author
        const userInformation = await database.collections.users.findOne(
            { _id: new DatabaseService.ObjectId(article.authorID) },
            { projection: { firstname: 1, lastname: 1, url: 1 } }
        );

        // Check if userInformation is not null before assigning it to the userInformation variable
        const authorInformation = userInformation ? {
            firstname: userInformation.firstname,
            lastname: userInformation.lastname,
            url: userInformation.url,
        } : {
            firstname: 'Unknown',
            lastname: 'Author',
            url: '../assets/pics/2c80ydc.jpg', 
        };

        res.render('articles/singleArticle.ejs', {
            article: article,
            userInformation: authorInformation,
        });
    });

    

    // Rendering the update articles view
    router.get('/updateArticles/:id', helpers.isAuthenticated, async (req, res) => {
        // Fetch the single article that matches the ID passed into the params
        let article = await database.collections.articles.findOne(new DatabaseService.ObjectId(req.params.id));
        res.render('articles/edit.ejs', { error: null, article: article });
    });

    // Update an existing article
    router.post('/updateArticles/:id', helpers.isAuthenticated, async (req, res) => {
        // Get the update form's data
        let data = req.body;

        let articleID = new DatabaseService.ObjectId(req.params.id);

        // If the data passed in doesn't match what's expected, render the update article view again with an error to display
        if (Object.keys(data).length <= 0 || (!data.headline || !data.content)) {
            res.render('articles/edit.ejs', { error: "There was an issue updating the article." });
            return;
        }

        // Update an existing article
        await database.collections.articles.updateOne({ _id: articleID }, { $set: { title: data.headline, content: data.content } });

        // Once article is updated, redirect to the updated article view
        res.redirect(301, `/articles/${req.params.id}`);
    });


    // Delete user account
    router.get('/deleteProfile', helpers.isAuthenticated, async (req, res) => {
        const userId = new DatabaseService.ObjectId(req.user.id);

        // Delete the user's articles
        await database.collections.articles.deleteMany({ authorID: userId });

        // Delete the user
        await database.collections.users.deleteOne({ _id: userId });

        // Log the user out
        req.logout((error) => {
            if (error) {
                // Handle logout error
                console.error('Logout failed:', error);
                res.status(500).send('Logout failed');
            } else {
                // Once the user account is deleted and logged out, redirect to the home page or any other desired page
                res.redirect('/');
            }
        });
    });

    // Rendering the update profile view
    router.get('/updateProfile', helpers.isAuthenticated, async (req, res) => {
        const userId = new DatabaseService.ObjectId(req.user.id);

        // Fetch user information
        const userInformation = await database.collections.users.findOne(
            { _id: userId }
        );

        res.render('articles/updateProfile.ejs', {
            title: 'Update Profile',
            user: userInformation,
            error: null, // Initialize error as null
        });
    });

    // Update user profile
    router.post('/updateProfile', helpers.isAuthenticated, async (req, res) => {
        const userId = new DatabaseService.ObjectId(req.user.id);
        const data = req.body;

        // If the data passed in doesn't match what's expected, render the update profile view again with an error to display
        if (Object.keys(data).length <= 0 || (!data.firstname || !data.lastname || !data.username || !data.email || !data.password || !data.url )) {
            const userInformation = await database.collections.users.findOne(
                { _id: userId }
            );
            res.render('articles/updateProfile.ejs', { 
                error: "There was an issue updating the profile.", 
                user: userInformation,
                title: 'Update Profile',
            });
            return;
        }

        // Update user profile
        await database.collections.users.updateOne(
            { _id: userId },
            { $set: { firstname: data.firstname, lastname: data.lastname, username: data.username, email: data.email, password: data.password, url: data.url} }
        );

        // Once the profile is updated, redirect to the profile page
        res.redirect('/profile');
    });



    // Delete an existing article
    router.get('/deleteArticle/:id', helpers.isAuthenticated, async (req, res) => {

        const articleID = new DatabaseService.ObjectId(req.params.id);

        // Delete the article
        await database.collections.articles.deleteOne({ _id: articleID });

        // Once the article is deleted, redirect to the profile page or any other desired page
        res.redirect(301, '/profile');
    });

    return router;
}

module.exports = ArticleRouter;
