const express = require('express');
const router = express.Router();
//pool hace referencia a la conexion a la base de datos
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add',isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add',isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newlink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links SET ?', [newlink]);
    console.log(newlink);
    req.flash('completado','Guardado Correctamente');
    res.redirect('/links');
});

router.get('/', isLoggedIn ,async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?',[req.user.id]);
    console.log(links);
    res.render('links/list', { links });
});

router.get('/delete/:id', isLoggedIn ,async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID=?', [id]);
    req.flash('completado','Se Elimino Correctamente');
    res.redirect('/links');
    //console.log(req.params.id);
    //res.send('Eliminado');
});

router.get('/edit/:id', isLoggedIn ,async (req, res) => {
    const { id } = req.params;

    const links = await pool.query('SELECT * FROM links WHERE ID=?', [id]);
    console.log(links[0]);
    res.render('links/edit', { link: links[0] });
    //console.log(id);
    //res.send('resivido');

});

router.post('/edit/:id', isLoggedIn ,async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newlink = {
        title,
        description,
        url
    };
    //console.log(id);
    //console.log(newlink);
    //res.send('Actualizado');
    await pool.query('UPDATE links SET ? WHERE ID = ?', [newlink, id]);
    req.flash('completado','Editado Correctamente');
    res.redirect('/links');
});
module.exports = router;