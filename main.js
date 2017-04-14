const express = require('express'),
    path = require('path'),
    app = express()
app.use(express.static('.'));
app.use(express.static('public'));
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(8887,() => {
    console.log('Server running on port 8889')
})