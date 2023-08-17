const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path'); 

const app = express();

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', 'handlebars');

app.use('/', require('./routes/pages')); 

app.listen(8080);