const {PORT,DB_HOST,DB_USER,DB_PASSWORD,DB_PORT,DB_DATABASE} = require('./routes/config.js');
module.exports={
    database:{
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port:DB_PORT,
        database: DB_DATABASE

    }
};