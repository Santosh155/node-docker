const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
let RedisStore = require('connect-redis')(session);
let RedisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
});
const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET,
} = require('./config/config');

const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');

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

app.use(
    session({
        store: new RedisStore({ client: RedisClient }),
        secret: SESSION_SECRET,
        cookie: {
            secure: false,
            resave: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 30000,
        },
    })
);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h3>Is docker working fine? yes or no</h3>');
});

app.use('/api/v1/post', postRoute);
app.use('/api/v1/users', userRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});
