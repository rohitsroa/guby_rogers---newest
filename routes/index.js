var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
// Get Page model
var Price = require('../models/price');
var Customer = require('../models/customer');
var dateTime = require('node-datetime');
var datetime = require('node-datetime');
var passport = require('passport');
var bcrypt = require('bcryptjs');
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var isEmp = auth.isEmp;
// Get Users model
var User = require('../models/user');

/* * GET products index
 */
router.get('/',function (req, res) {
    Price.find(function (err, prices) {
                res.render('index', {
                    prices:prices,
                 })});
});
router.get('/admin/area',function (req, res) {
    res.render('admin/customers');


});
router.get('/thankyou',function (req, res) {
    res.render('thankyou');


});
router.get('/admin/employee', function (req, res) {
      User.find({}).sort({sorting: 1}).exec(function (err, user) {
        res.render('_layouts/adminheader',{
            user:user
        })});
  });
router.get('/admin/prices',function (req, res) {
    Price.find({}).sort({sorting: 1}).exec(function (err, prices) {
        res.render('admin/prices', {
            prices: prices
        });
    });
});
router.get('/admin/customers',function (req, res,next) {
        Customer.paginate({}, { page: 1, limit: 10 , sort: { date: -1 }}, function(err, customer) {
        res.render('admin/customers', {customer:customer.docs,total:customer.total,limit:customer.limit,
            page:customer.page,
            pages:customer.pages
        })});
    });
router.get('/admin/customers/:page-:limit', function(req, res,next) {
    var page=req.params.page || 1;
    var r_limit=req.params.limit || 2;
    var limit=parseInt(r_limit);

        Customer.paginate({}, { page: page, limit:limit, sort: { date: -1 }}, function(err, customer) {
    res.render('admin/customers', {customer:customer.docs,total:customer.total,limit:customer.limit,
      page:page,
      pages:customer.pages
    });
    })});

/*
 * GET edit price
 */
router.get('/admin/prices/edit-price/:id',function (req, res) {

    Price.findById(req.params.id, function (err, prices) {
        if (err)
            return console.log(err);

        res.render('admin/edit_price', {
            title: prices.title,
            amount: prices.amount,
            id: prices._id
        });
    });

});
/*
 * GET edit price
 */
router.get('/admin/customers/edit-status/:id',function (req, res) {

    Customer.findById(req.params.id, function (err, customers) {
        if (err)
            return console.log(err);

        res.render('admin/edit_customer', {
            handled: customers.handled,
            id: customers._id
        });
    });

});
/*
 * GET delete page
 */
router.get('/admin/customers/delete-customer/:id', function (req, res) {
    Customer.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            return console.log(err);

        Customer.find({}).sort({sorting: 1}).exec(function (err, customers) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.customers = customers;
            }
        });

        req.flash('success', 'Customer deleted!');
        res.redirect('/admin/customers/');
    });
});
/*
 * POST reorder pages
 */
router.post('/admin/prices/reorder-pages', function (req, res) {
    var ids = req.body['id[]'];


        Price.find({}).sort({sorting: 1}).exec(function (err, prices) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.prices = prices;
            }
        });
    });

/*
 * POST edit price
 */
router.post('/admin/prices/edit-price/:id', function (req, res) {
    var title = req.body.title;
    var amount = req.body.amount;
    var id = req.params.id;

        Price.findById(id, function (err, prices) {
            if (err)
                return console.log(err);

                prices.title = title;
                prices.amount = amount;

                prices.save(function (err) {
                    if (err)
                        return console.log(err);
                    Price.find({}).sort({sorting: 1}).exec(function (err, prices) {
                        if (err) {
                                console.log(err);
                        } else {
                                req.app.locals.prices = prices;
                        }
                        });
                req.flash('success', 'Price edited!');
                res.redirect('/admin/prices/');
                    });

                });
            });
/*
 * POST edit price
 */
router.post('/admin/customers/edit-status/:id', function (req, res) {
    var handled = req.body.handled;
    var id = req.params.id;

        Customer.findById(id, function (err, customers) {
            if (err)
                return console.log(err);

                customers.handled = handled;

                customers.save(function (err) {
                    if (err)
                        return console.log(err);
                    Customer.find({}).sort({sorting: 1}).exec(function (err, customers) {
                        if (err) {
                                console.log(err);
                        } else {
                                req.app.locals.customers = customers;
                        }
                        });
                res.redirect('/admin/customers/');
                    });

                });
            });
router.post('/buypack/:packagename', function (req, res) {
                var packagename = req.params.packagename;
                var dt = datetime.create();
                var date = dt.format('W d/m/Y I:M p');
                var customer=new Customer({
                    date:date,
                    customerid:req.body.customerid,
                    handled : req.body.handled,
                    packagename: packagename,
                    message:req.body.message,
                    email:req.body.email,
                    name:req.body.name,
                    phone:req.body.phone,
                });
                customer.save(function (err) {
                    if (err)
                        return console.log(err);
            });
        res.render('thankyou');
        });

/*
 * GET register
 */
router.get('/admin/register', function (req, res) {

    res.render('register', {
    });

});

/*
 * POST register
 */
router.post('/admin/register', function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name', 'Name is required!').notEmpty();
    req.checkBody('email', 'Email is required!').isEmail();
    req.checkBody('username', 'Username is required!').notEmpty();
    req.checkBody('password', 'Password is required!').notEmpty();
    req.checkBody('password2', 'Passwords do not match!').equals(password);
    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors,
            user: null,
        });
    } else {
        User.findOne({username: username}, function (err, user) {
            if (err)
                console.log(err);

            if (user) {
                req.flash('danger', 'Username exists, choose another!');
                res.redirect('/admin/register');
            } else {
                var dt = datetime.create();
                var date = dt.format('d/m/Y I:M p');
                var user = new User({
                    date:date,
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    admin:0
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err)
                            console.log(err);

                        user.password = hash;

                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash('success', 'You are now registered!');
                                res.redirect('/admin')
                            }
                        });
                    });
                });
            }
        });
    }

});

/*
 * GET login
 */
router.get('/admin', function (req, res) {

    if (res.locals.user) res.redirect('/admin');
    
    res.render('login');

});

/*
 * POST login
 */
router.post('/admin',function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/admin/customers',
        failureRedirect: '/admin',
        failureFlash: true
    })(req, res, next);
    
});
/*
 * GET logout
 */
router.get('/logout', function (req, res) {

    req.logout();
    
    req.flash('success', 'You are logged out!');
    res.redirect('/admin');

});
router.get('/admin/users/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            return console.log(err);

        User.find({}).sort({sorting: 1}).exec(function (err, users) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.users = users;
            }
        });

        req.flash('success', 'User Deleted');
        res.redirect('/admin/users/');
    });
});

router.get('/admin/users',function (req, res) {
    User.find({}).sort({sorting: 1}).exec(function (err, users) {
        res.render('admin/users', {
            users: users
        });
    });
});
// Exports
module.exports = router;
