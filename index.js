const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('./config');
const app = express();
const routes = require('./routes')

const mongoose = require('mongoose');

mongoose.connect(env.MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log("connection successful"))
.catch((err)=> console.log(err))

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json({ limit: '300mb', extended: true }));
app.use(bodyParser.urlencoded({
    limit: '100mb', extended: true, parameterLimit: 1000000,
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With,content-type', 'Accept', 'Authorization');
    next();
});

app.use('/api/v1/', routes);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT);