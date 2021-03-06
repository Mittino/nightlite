 'use strict';

const express = require('express');
const router = express.Router();
const ev = require('express-validation');
const validations = require('../validations/comments');
const knex = require('../knex');

const bodyParser = require('body-parser');

//if not logged in, no access
router.use(function (req,res,next) {
  if (!req.session) {
    res.sendStatus(401);
  } else {
    next();
  }
});

//get comments for a given user
router.get('/comments/users/', (req, res, next) => {
  let admin = req.session.isAdmin;
  let userid = req.session.id;

  if (admin === true){
    knex.from('comments').leftJoin('users', 'comments.user_id', 'users.id')
   .select(['comments.id', 'comments.user_id', 'comments.comment', 'comments.stars', 'comments.created_at', 'comments.updated_at', 'username', 'admin'])
   .orderBy('comments.id', 'desc')
   .then((results) => {
     res.send(results);
   })
   .catch((err) => {
     next(err);
   });
  } else {
   knex.from('comments').leftJoin('users', 'comments.user_id', 'users.id')
     .where({
       'user_id': userid})
    .select(['comments.id', 'comments.user_id', 'comments.comment', 'comments.stars', 'comments.created_at', 'comments.updated_at', 'users.username', 'admin'])
    .orderBy('comments.id', 'desc')
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      next(err);
    });
  }
});

//get comments for a given observation id
router.get('/comments/obs/:obsid', (req, res, next) => {
  let observationId = parseInt(req.params.obsid);

   knex.from('comments').leftJoin('observations', 'comments.id', 'observations.id')
   .where({
     observation_id: observationId
   })
  //.orderBy('updated_at', 'desc')
  .then((results) => {
    res.send(results);
    console.log(results);
  })
  .catch((err) => {
    next(err);
  });
});

//get comments for a given observation id
router.get('/comments/obs/:obsid', (req, res, next) => {
  let observationId = parseInt(req.params.obsid);

   knex.from('comments').leftJoin('observations', 'comments.id', 'observations.id')
   .where({
     observation_id: observationId
   })
  //.orderBy('updated_at', 'desc')
  .then((results) => {
    res.send(results);
  })
  .catch((err) => {
    next(err);
  });
});

//TODO update observaton_id and user_id location from post request - is it in body or cookie??
router.post('/comments', ev(validations.post), (req, res, next) => {
  let userId = req.session.id;
  // let username = req.session.username;

  console.log(req.body);
    knex('comments')
      .insert({
        user_id: userId,
        observation_id: req.body.observation_id,
        comment: req.body.comment,
        stars: req.body.stars,
      })
      .then(
        res.send('update comment')
        // res.send(userId);
      )
      .catch((err) => {
        next(err);
      });

});
//patch comment by id
router.patch('/comments/:id', (req, res, next) => {
  var id = req.params.id;
  knex('comments')
  .where({
    id: id
  })
  .first()
  .then((comment) => {
    if (!comment || !req.body.comment){
      return next();
    } return knex('comments')
    .update({
      comment: req.body.comment
    }, '*')
    .where({'id' : id});
  })
  .then((comments) => {
    res.send(comments[0]);
  })
  .catch ((err) => {
    next(err);
  });
});

//delete comment by id
router.delete('/comments/:id', (req, res, next) => {
  var id = req.params.id;
  let comment;

  knex('comments')
  .where('id', id)
  .first()
  .then ((result) => {
    if (!result) {
      return next();
    }
  comment = result;

  return knex('comments')
    .del()
    .where('id', id);
  })
  .then(() => {
    delete comment.id;
    res.send(comment);
  })
  .catch((err) => {
    next(err);
  });
});


//
module.exports = router;
