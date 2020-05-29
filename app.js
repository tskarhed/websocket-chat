const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Who am I?'));
app.get('/test', (req, res) => {
    res.set('X-Custom-header', "I'm a teapot damnit!");
    res.status(418);
    return res.send();
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
