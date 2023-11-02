var express = require('express');
var router = express.Router();
var novedadesmodel = require('../../models/novedadesmodel')

router.get('/', async function (req, res, next) {
    var novedades = await novedadesmodel.getnovedades()

    res.render('admin/novedades', {
        layout: 'admin/layout',
        usuario: req.session.usuario, 
        novedades

    });
});

router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;
  await novedadesmodel.deleteNovedadesById(id);
  res.redirect('/admin/novedades')
});

router.get('/agregar', async (req, res, next) => {
  res.render('admin/agregar', {
      layout: 'admin/layout'
  });
});

router.post('/agregar', async (req, res, next) => {
  try {
      if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
          await novedadesmodel.insertNovedades(req.body);
          res.redirect('/admin/novedades')
      } else {
          res.render('admin/agregar', {
              layout: 'admin/layout',
              error: true,
              message: 'todos los campos son requeridos'
          });
      }
  } catch (error) {
    console.log(error)
      res.render('admin/agregar', {
          layout: 'admin/layout',
          error: true,
          message: 'no se cargo al novedad'
      });
  }
});

router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  let novedad = await novedadesmodel.getNovedadesById(id);
  res.render('admin/modificar', {
      layout: 'admin/layout',
      novedad
  });
});

router.post('/modificar', async (req, res, next) => {
  try {
      let obj = {
          titulo: req.body.titulo,
          subtitulo: req.body.subtitulo,
          cuerpo: req.body.cuerpo
      }
      console.log(obj)
      await novedadesmodel.modificarNovedadesById(obj, req.body.id);
      res.redirect('/admin/novedades');
  } catch (error) {
      console.log(error)
      res.render('admin/modificar', {
          layout: 'admin/layout',
          error: true,
          message: 'no se modifico la novedad'
      })
  }
});

module.exports = router;