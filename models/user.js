"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  role: { type: String, required: true},
  name: { type: String, required: true},
  surname: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: { type :String, required: true},
  profession: { type: Array},
  address: { type: String},
  telephone: { type: Number}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
