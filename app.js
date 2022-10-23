const express = require('express');
const dotenv = require('dotenv');
const router = require('./routers');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(process.env.APP_PORT, () => {
    console.log(`Server running at http://localhost:${process.env.APP_PORT}`);
});