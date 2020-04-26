// Va nous permettre d'avoir accès à process.env
require("dotenv").config();
// ENVIRONNEMENT EXPRESS
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(formidable());

// MAILGUN CONFIGURATION
const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({
    apiKey: API_KEY,
    domain: DOMAIN,
});

// ROUTES

app.get("/", (req, res) => {
    res.send("server is up");
});

app.post("/", (req, res) => {
    /* DESTRUCTURING */
    const {
        firstname,
        lastname,
        email,
        subject,
        message
    } = req.fields;

    /* CREATION DE L'OBJET DATA */
    const data = {
        from: `${firstname} ${lastname} <${email}>`,
        to: "gerald.berrebi@gmail.com",
        subject: subject,
        text: message,
    };

    /* ENVOI DE L'OBJET VIA MAILGUN */
    mailgun.messages().send(data, (error, body) => {
        if (!error) {
            return res.json(body);
        }
        res.status(401).json(error);
    });
});
app.listen(process.env.PORT, () => {
    console.log("server is listening on PORT : " + process.env.PORT);
});