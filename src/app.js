require('dotenv').config();
const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const helmet = require('helmet');
const router = require('./routes');

const host = process.env.HOST;
const port = process.env.PORT;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));
app.use(helmet());

app.use(express.urlencoded({ extended: true }));

app.use('/', router);

process.on('uncaughtException', function (err) {
    console.log(err);
});

app.listen(port, () => debug(`listening on port ${port}, ${host}:${port}/`));
