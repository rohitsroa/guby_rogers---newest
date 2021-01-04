var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var mongoosePaginate = require('mongoose-paginate');
var conn =mongoose.Collection;
// Page Schema
var CustomerSchema = mongoose.Schema({
   
    handled: {
        type: String,
        default:'No'
    },
    date: {
        type: String,
    },
    packagename: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    message: {
        type: String
    },
    customerid:{
        type: Number
    }
});
CustomerSchema.plugin(mongoosePaginate);
CustomerSchema.plugin(autoIncrement.plugin, {
    model: 'Customers',
    field:'customerid',
    prefix:'CUST_',
});

var Customer = module.exports = mongoose.model('Customer', CustomerSchema);