const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;



const promotionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: currency,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamp: true
});

var Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;