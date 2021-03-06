const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const cors = require('cors');
let RedisStore = require('connect-redis')(session);

const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET,
} = require('./config/config');

let RedisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
});

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
app.use(cors({}));
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

app.enable('trust proxy');
app.use(express.json());

app.get('/api/v1', (req, res) => {
    console.log('load blancing test!!');
    res.send('<h3>Is docker working fine? yes or no</h3>');
});

app.use('/api/v1/post', postRoute);
app.use('/api/v1/users', userRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});
