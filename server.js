
// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var request = require('request');
var colors = require('colors');
var path = require('path');
// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//console.log((path.resolve(__dirname + '/View')).replace(/\\/g, "/").red);
//app.use(express.static((path.resolve(__dirname + '/View')).replace(/\\/g, "/")));

//Database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bitcoin"
});

con.connect(function(err) {
  if (err) throw err;          
  console.log("Connected to database!"); 
});

//fetch data
request('https://bittrex.com/api/v1.1/public/getmarkets', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.result[0]);
});	

// Routes
app.post('/signin', function(req, res){	
	var email = req.body.email;
	var password = req.body.password;
	con.query("SELECT * FROM users where email='" + email + "'", function (err, result, fields) {
    if (err) throw err;
    if (result.length > 0){
    	if (password = result[0].password){
    		res.json({message: 'data from database!'});

    	} else{
    		res.json({err: 'email or password not correct!'});
    	}
    } else{
    	res.json({err: 'email or password not correct!'});
    }
    });
});

app.post('/signup', function(req, res){
	var firstName = req.body.firstName;
	var password = req.body.password;
	var familyName = req.body.familyName;
	var email = req.body.email;
	var phone = req.body.phone;

	// var x = "insert into users values (null, '" + firstName + "', '"+ familyName + "', '"+ email + "', " + phone + ",'"+ password + "')";
	// console.log(x);
	
	con.query("SELECT * FROM users where email='" + email + "'", function (err, result, fields) {
    if (err) throw err;
    if (result.length == 0){
    	con.query("insert into users values (null, '" + firstName + "', '"+ familyName + "', '"+ email + "', " + phone + ",'"+ password + "')", function(err, result, fields){
    		if(err) throw err;
    		res.json({message: 'user created!'});
    	})
    } else{
    	res.json({err: 'email is taken!'});
    }
    });
});

// Start server
app.listen(3000, function(){
	console.log('API is running on port 3000');
});

