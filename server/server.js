const express = require('express')
const app = express()

app.listen(3000)

app.get('/asdf', (req, res) => {
    console.log('Here')

    res.send("asdf")
})