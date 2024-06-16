const bcrypt = require('bcryptjs');
const helpers = {};

//cifrar el dato cuando se registra el usuario 
helpers.encryPassword = async (password) => {
    const salt = await bcrypt.genSaltSync(10);
    //empieza a cifrar
    const hash = await bcrypt.hash(password,salt);
    return hash;
};


//cuando se loguea
helpers.matchPassword = async (password,savedPassword) => {
    try {
        return await bcrypt.compare(password,savedPassword);
    } catch (error) {
        console.log(e);
    }
};

module.exports = helpers;