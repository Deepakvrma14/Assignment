const express = require('express');
const fs = require('fs');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/top-users', (req, res) => {
    const { topN } = req.body;
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
            return;
        }
        const jsonData = JSON.parse(data);
        const users = jsonData.users;
        const topUsers = users.sort((a, b) => b.value - a.value).slice(0, topN);
        res.json(topUsers);
    });
});

app.get('/charts', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
            return;
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData.charts);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
