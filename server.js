
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
var path = require('path');
var oauth2 = require('salesforce-oauth2');

var consumerKey = process.env.CONSUMER_KEY;
var secretKey = process.env.CONSUMER_SECRET;
var callbackURL = process.env.CALLBACK_URL;

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.get('/oauth2/auth', function (req, res) {
	var uri = oauth2.getAuthorizationUrl({
        redirect_uri: callbackURL,
        client_id: consumerKey,
        scope: 'api'
    });
    return res.redirect(uri);
})

app.post('/RestTest/oauth/callback', function(req, res) {
  	var code = req.body.code;
  	code = code.replace(/%3D/g, '=')
  	oauth2.authenticate({
        redirect_uri: callbackURL,
        client_id: consumerKey,
        client_secret: secretKey,
        code: code
    }, function(error, payload) {
    	if(error) {
    		res.send(error)
    	} else {
    		res.send(payload)
    	}
    })
})

var port = process.env.PORT || 3000;
app.listen(port);
