const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser());

app.post('/', function(req, res){
    const body = req.body;
    console.log('my bot payload', body);
    res.status(200).send('OK')
})

app.listen(process.env.PORT || 4747, () => console.log('Server is live and good'));