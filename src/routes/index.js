const express = require('express');
const router = express.Router();

const config = require('./config')

router.get('/',(req,res)=>{
    res.render('index');
});

module.exports = router;