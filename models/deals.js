"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dealSchema = new Schema({
  customerId: { type: String },
  professionalId: { type: String, required: true },
  description: { type: String },
  street: { type: String, required: true },
  city: { type: String, required: true },
  postcode: { type: Number, required: true },
  country: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  accepted: { type: Boolean, required: true }
});

const Deal = mongoose.model("Deal", dealSchema);

module.exports = Deal;