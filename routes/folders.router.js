const knex = require('../knex');
const express = require('express');
const router = express.Router();

router.get('/folders',(req,res,next)=> {
  knex.select('id','name')
  .from('folders')
  .then(results => {
    res.json(results);
  })
  .catch(err => next(err));

});
/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.get('/folders/:id', (req, res, next) => {
  console.log(req.params.id);
  knex.select('id', 'name')
    .from('folders')
    .where('id', req.params.id)
    
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});
/* ========== POST/CREATE ITEM ========== */
router.post('/folders',(req,res,next) => {
  const {name} = req.body;

if (!name) {
  const err = new Error('Missing `title` in request body');
  err.status = 400;
  return next(err);
}

const newItem = { name };

knex('folders')
  .insert(newItem)
  .into('folders')
  .returning(['id'])
  .then(([result]) => {
    if(result) {
      res.json(result);
    } else {
      next();
    }
  })
  .catch(err => next(err));
});
router.put('/folders/:id', (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateItem = { name };

  knex('folders')
    .update(updateItem)
    .where('id', req.params.id)
    .returning(['id', 'name'])
    .then(([result]) => {
      if(result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.delete('/folders/:id', (req, res, next) => {
  knex.del()
    .where('id', req.params.id)
    .from('folders')
    .then(count => {
      res.status(204).end();
    })
    .catch(next);
});


module.exports = router;