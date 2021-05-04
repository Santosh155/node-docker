const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose
    .connect('mongodb://santosh:mypass@mongodb:27017/?authSource=admin', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log('DB connected');
    })
    .catch((err) => {
        console.log(err);
    });

app.get('/', (req, res) => {
    res.send('<h3>Is docker working fine? yes or no</h3>');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});
