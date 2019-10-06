require('dotenv/config');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
const parseString = require('xml2js').parseString;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Test</h1>');
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    axios
        .get(
            `${process.env.KOHA_URL}/cgi-bin/koha/ilsdi.pl?service=AuthenticatePatron&username=${username}&password=${password}`
        )
        .then(response => {
            parseString(response.data, function(err, result) {
                if (result.AuthenticatePatron.id) {
                    const userId = result.AuthenticatePatron.id[0];
                    return res.status(200).json({ userId });
                }
                return res.status(401).json({ msg: 'Failed login' });
            });
        });
});

app.listen(process.env.PORT);
