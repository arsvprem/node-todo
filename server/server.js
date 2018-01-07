const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt
  });

  todo.save()
    .then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({todos});
    }, (err) => {
      console.log(err);
    });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id)
    .then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }).catch((e) => {
      return res.status(400).send();
    });
});


app.listen(3000, () => {
  console.log('App Started on port 3000');
});


module.exports = {app};