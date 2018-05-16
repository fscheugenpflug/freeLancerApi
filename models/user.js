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
  telephone: { type: Number},
  description: { type: String},
  street: { type: String},
  city: { type: String},
  postcode: { type: Number},
  country: { type: String}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
