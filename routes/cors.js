const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:1000', 'https://localhost:1443', 'http://localhost:6422'];
const corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1)
        corsOptions = { origin: true };
    else
        corsOptions = { origin: false };

    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);