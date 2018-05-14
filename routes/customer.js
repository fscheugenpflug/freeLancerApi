"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");

router.get("/:profession", (req, res, next) => {
  const professionFront = req.params.profession
  User.find({ profession: { $in: [professionFront]}})
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

module.exports = router;