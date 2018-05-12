"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");

router.get("/:profession", (req, res, next) => {
  User.find(req.params.profession)
    .then(result => {
      res.json(result);
    })
    .catch(next);
});
