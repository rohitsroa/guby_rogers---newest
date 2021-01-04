var engines =require('consolidate');
var express = require('express');
var cors=require('cors');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var autoIncrement = require('mongoose-auto-increment');
const request = require("request");
var datetime = require('datetime');
var exphbs = require('express-handlebars');
var mkdirp=require('mkdirp');
var fileUpload = require('express-fileupload');
var datetime = require('datetime');
var dateTime = require('node-datetime');
var passport = require('passport');
var api = express.Router();
// Connect to db
mongoose.connect('mongodb://localhost:27017/gubyrogers',{ useNewUrlParser: true ,useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});
var connection = mongoose.createConnection("mongodb://localhost:27017/gubyrogers");
autoIncrement.initialize(connection);

// Init app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs','pug','html','handlebars');

// Set public folder
app.use(cors()); 
app.engine('handlebars',exphbs());
app.use(express.static(path.join(__dirname, 'views',)));
app.use(express.static(path.join(__dirname, 'public',)));


// Set global errors variable
app.locals.errors = null;
app.use(passport.initialize());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(fileUpload());
// Express Session middleware
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
//  cookie: { secure: true }
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
// Get Category Model
var Price = require('./models/price');
// Get all categories to pass to header.ejs
Price.find(function (err, prices) {
    if (err) {
        console.log(err);
    } else {
        app.locals.prices = prices;
    }
});
var Customer = require('./models/customer');
// Get all categories to pass to header.ejs
Customer.find(function (err, customers) {
    if (err) {
        console.log(err);
    } else {
        app.locals.customers = customers;
    }
});
var User = require('./models/user');
// Get all categories to pass to header.ejs
   User.find(function (err, users) {
    if (err) {
        console.log(err);
    } else {
        app.locals.users = users;
    }
});
app.use(expressValidator());
var index=require('./routes/index');
app.use('/',index);
module.exports=app;
app.get('*', function(req,res,next) {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
 });
const server=express(); 
server.use(expressValidator()); 

// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));
// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res,next) {
   res.locals.user = req.user || null;
   next();
});
// Start the server
var port = 3000;
app.listen(port, function () {
    console.log('Server started on port ' + port);
});
