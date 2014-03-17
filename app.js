var express = require('express');
var twig = require('twig');
var app = express();

// Configuration des middlewares
app
    .use(express.query())
//    .use(express.bodyParser());
app.set('views', 'static');
app.set('view engine', 'html');
app.engine('html', twig.__express);
    
app.use('/s', express.static('static'));


app.get('/', function(req, res) {
     res.render('home.html',{'texte':""});
});

//fonction qui sur une requete post vérifie la cohérence des données et envoie les informations a la page /play

app.post('/play', function(req, res) {
    if(req.body.jou1 === req.body.jou2)  {res.render('home.html',{'texte' : "Veuillez choisir des noms differents pour les deux joueurs" });}
    if(req.body.coul1 === req.body.coul2)  {res.render('home.html',{'texte' : "Veuillez choisir des couleurs differentes pour les deux joueurs" });}
    res.render('puiss4.html',{ 'nom1' : req.body.jou1,'nom2' : req.body.jou2,'coul1' : req.body.coul1,'coul2' : req.body.coul2,'score1' : req.body.score1,'score2' : req.body.score2 });
});

//fonction qui sur une requete get vérifie la cohérence des données et envoie les informations a la page /play

app.get('/play', function(req, res) {
    if(req.query.jou1 === req.query.jou2)  {res.render('home.html',{'texte' : "Veuillez choisir des noms differents pour les deux joueurs" });}
    if(req.query.coul1 === req.query.coul2)  {res.render('home.html',{'texte' : "Veuillez choisir des couleurs differentes pour les deux joueurs" });}
    res.render('puiss4.html',{ 'nom1' : req.query.jou1,'nom2' : req.query.jou2,'coul1' : req.query.coul1,'coul2' : req.query.coul2,'score1' : req.query.score1,'score2' : req.query.score2 });
});

    
app.listen(8080);