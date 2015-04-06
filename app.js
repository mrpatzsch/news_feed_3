var express = require('express');
var bodyParser = require('body-parser');
var pg = require("pg");
var methodOverride = require("method-override");


var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));


// Refactor connection and query code
var db = require("./models");

app.get('/articles', function(req,res) {
	db.Article.all().then(function(articles) {
		res.render('articles', {articlesList: articles, article: articles});
	})
});

app.get('/articles/new', function(req,res) {
  	res.render('articles/new');
});

app.post('/articles', function(req,res) {
	db.Article.create({title:req.body.title, author:req.body.author, content:req.body.content}).then(function(articles) {
		console.log('did an article get added?');
	});
	res.redirect('/articles');
});

app.get('/articles/:id', function(req, res) {
	db.Article.find(req.params.id).then(function(articles) {  
		res.render('articles/article', {article: articles, id: req.params.id });
	})
});

app.get('/articles/:id/edit', function(req,res) {
	db.Article.find(req.params.id).then(function(articles) {
  		res.render('articles/edit', {article: articles, id: req.params.id});
  		});
});

app.post('/articles/:id', function(req,res) {
	db.Article.find(req.params.id).then(function(article) {
		article.updateAttributes ({
			title: req.body.article.title, 
			author: req.body.article.author,
			content: req.body.article.content
			}).then(function(articles) {
				res.render('articles/article', {article: articles, id: req.params.id });
		})
	})
});

app.delete('/articles/:id', function(req,res) {
	db.Article.find(req.params.id).then(function(articles) {
		articles.destroy();
		res.render('/articles');
	})
});

app.get('/', function(req,res) {
  res.render('site/index.ejs');
});

app.get('/about', function(req,res) {
  res.render('site/about');
});

app.get('/contact', function(req,res) {
  res.render('site/contact');
});

app.listen(3000, function() {
  console.log('Listening');
});
