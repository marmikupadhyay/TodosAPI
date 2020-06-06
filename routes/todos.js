const express = require("express");
const router = express.Router();

const Todo = require("../models/todo");

//Request for Viewing
router.get("/", (req, res, next) => {
  console.log("Get request recived");
  var query, limit;
  if (req.query.id !== undefined) {
    query = { _id: req.query.id };
  } else {
    query = {};
  }
  if (req.query.s !== undefined) {
    limit = req.query.s;
  } else {
    limit = Todo.count();
  }
  Todo.find(query)
    .sort({ updated: -1 })
    .limit(Number.parseInt(limit))
    .then(todos => {
      var singleTodo;
      res.status(200);
      if (todos.length == 1 && limit != 1) {
        singleTodo = todos[0];
        res.json(singleTodo);
      } else {
        res.json(todos);
      }
    })
    .catch(err => {
      console.log(err);
      var error = { msg: "Server Side Error" };
      res.status(500);
      res.json(error);
    });
});

//Request to add a new TODO
router.post("/", (req, res) => {
  const { title, body, priority } = req.body;
  if (!priority || !title || !body) {
    var error = { msg: "Client Side Error" };
    res.status(400);
    res.json(error);
  }
  var newTodo = new Todo({ title, body, priority });
  newTodo
    .save()
    .then(todo => {
      res.status(201);
      res.json(todo);
    })
    .catch(err => {
      console.log(err);
      var error = { msg: "Server Side Error" };
      res.status(500);
      res.json(error);
    });
});

//Request for Update
router.patch("/", (req, res, next) => {
  const { title, body, priority } = req.body;
  if (!priority || !title || !body) {
    var error = { msg: "Client Side Error" };
    res.status(400);
    res.json(error);
  }
  if (req.query.id !== undefined) {
    Todo.findOneAndUpdate(
      { _id: req.query.id },
      {
        $set: {
          title,
          body,
          priority,
          updated: Date.now()
        }
      },
      { new: true }
    )
      .then(todo => {
        res.json(todo);
      })
      .catch(err => {
        res.status(404);
        error = {
          msg: "That id does not exist."
        };
        res.json(error);
      });
  } else {
    res.status(400);
    error = {
      msg: "Pass a id parameter"
    };
    res.json(error);
  }
});

//Request for Deletion
router.delete("/", (req, res, next) => {
  if (req.query.id !== undefined) {
    Todo.findOneAndRemove({ _id: req.query.id })
      .then(todo => {
        res.json(todo._id);
      })
      .catch(err => {
        res.status(404);
        error = {
          msg: "That id does not exist."
        };
        res.json(error);
      });
  } else {
    res.status(400);
    error = {
      msg: "Pass a id parameter"
    };
    res.json(error);
  }
});

module.exports = router;
