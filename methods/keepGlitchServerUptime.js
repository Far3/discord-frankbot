const express = require('express');
const keepalive = require('express-glitch-keepalive');
const app = express();

app.use(keepalive);
app.get('/', (req, res) => {
res.json({
    'message': 'This bot should be online! Uptimerobot will keep it alive',
    'uptime robot': 'https://stats.uptimerobot.com/2G0OZTkVwB'
    });
});
app.get("/", (request, response) => {
    response.sendStatus(200);
});
app.listen(process.env.PORT);

module.exports.keepUptime;