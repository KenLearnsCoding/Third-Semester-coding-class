const express = require ('express')
const app = express();
const port = process.env.Port || 8000;
const path = require ('path');

app.use(express.static(path.join(__dirname,'public')));

app.get('/portfolio', async (req, res) => {
    // call the module esj
    let ejs = require('ejs');
    // create a string to let the portfolio params take data and the html variable can store the string 
    let portfolio = 'WEB DEVELOPER Hello, my name is Ken. A Passaionate Web Developer. This portfolio is a showcase of my work, skills, and experiences that Ive accumulated over the years.';
    // renderFile is like let the html join the portfolio.esj file with its data pushing into esj file. 
    let html = await ejs.renderFile(path.join(__dirname, 'view/portfolio.ejs'), {portfolio: portfolio});

    res.send(html);    
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});



