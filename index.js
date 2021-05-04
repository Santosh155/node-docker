const express = require('express');
const mongoose = require('mongoose');
const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
} = require('./config/config');

const postRoute = require('./routes/postRoute');

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        })
        .then(() => {
            console.log('DB connected');
        })
        .catch((err) => {
            console.log(err);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h3>Is docker working fine? yes or no</h3>');
});

app.use('/api/v1/post', postRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});
