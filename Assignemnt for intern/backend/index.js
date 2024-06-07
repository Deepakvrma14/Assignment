const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/dashboard-data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
            return;
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
