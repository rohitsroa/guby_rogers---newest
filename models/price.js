var mongoose = require('mongoose');

// Page Schema
var PriceSchema = mongoose.Schema({
   
    title: {
        type: String
    },
    amount: {
        type: Number
    },
    slug: {
        type: String
    },

});

var Price = module.exports = mongoose.model('Price', PriceSchema);