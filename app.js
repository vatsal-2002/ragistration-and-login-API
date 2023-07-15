const express = require('express');
const app = express();
const userRoute = require('./api/routes/user');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


mongoose.connect("mongodb://localhost:27017/LoginPage",{
    useNewUrlParser:true,
    useUnifiedTopology:true
},)
.then(() => console.log("connected with database"))
.catch((err) => {console.error(err); })

// });

app.use(fileUpload({
    useTempFiles: true
}))

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user', userRoute);

app.use((req, res, next) => {+
    res.status(404).json({
        erroe: 'Bed URL Request'
    })
})

module.exports = app;