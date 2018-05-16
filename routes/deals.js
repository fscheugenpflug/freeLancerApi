'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const Deal = require('../models/deals');

router.post('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  const customerId = req.session.currentUser._id;
  const professionalId = req.body.professionalId;
  const description = req.body.description;
  const street = req.body.street;
  const city = req.body.city;
  const postcode = req.body.postcode;
  const country = req.body.country;
  const date = req.body.date;
  const time = req.body.time;
  const accepted = req.body.accepted;

  console.log(customerId);

  // if (!customerId || !professionalId || !street || !city || !postcode || !country || !date || !time || !status) {
  //   return res.status(422).json({ code: "validation" });
  // }

      const newDeal = new Deal({
        customerId,
        professionalId,
        description,
        street,
        city,
        postcode,
        country,
        date,
        time,
        accepted,
      });

        newDeal.save()
        .then((result) => {
          res.status(201).json({code: "okay"});
      })
      .catch(next);
    });

router.get('/pending', (req, res, next) => {
  const currentId = req.session.currentUser._id;
  // const role = req.session.currentUser.role;
  const data = [];
  Deal.find({
    $or: [{ customerId: currentId }, { professionalId: currentId }]
  })
    .then(result => {
      result.forEach((item) => {
        if (item._doc.accepted === false){
          data.push(item);
        }
      });
      res.json(data);
      // res.json(role)
    })
    .catch(next);
});

router.get('/approved/upcoming', (req, res, next) => {
  const currentId = req.session.currentUser._id
  Deal.findById(currentId)
    .then(result => {
      if(result.approved === true){
        const currentDayAll = new Date();
        const currentDayFormatted = currentDayAll.toISOString();
        const currentDay = currentDayFormatted.slice(0, 10);
        const currentTime = currentDayFormatted.slice(11, 16)
        if (result.date >= currentDay) {
          res.json(result)
        }
      }
    })
    .catch(next)
});

router.get('/approved/bygone', (req, res, next) => {
  const currentId = req.session.currentUser._id
  Deal.findById(currentId)
    .then(result => {
      if(result.approved === true){
        const currentDayAll = new Date();
        const currentDayFormatted = currentDayAll.toISOString();
        const currentDay = currentDayFormatted.slice(0, 10);
        const currentTime = currentDayFormatted.slice(11, 16)
        if (result.date < currentDay) {
          res.json(result)
        }
      }
    })
    .catch(next)
});


router.put('/pending/updatedate/:id', (req, res, next) => {
  const dealId = req.params.id
  Deal.findByIdAndUpdate(dealId, req.body.setup)
    .then(result => {
      res.status(201).json({ code: "okay" });
    })
    .catch(next)
});

router.put("/pending/:id/updatestatus", (req, res, next) => {
  const dealId = req.params.id;
  Deal.findByIdAndUpdate(dealId, { $set: { 'accepted' : 'true' }})
    .then(result => {
      if (result.accepted ==="true"){
      res.status(201).json({ code: "okay" })
    } else {
      res.status(304).json({ code: "notmodified" })
    };
  })
    .catch(next);
});

router.delete("/pending/:id", (req, res, next) => {
  const dealId = req.params.id;
  Deal.findById(dealId)
    .then(result => {
      if(!result) {
        return res.status(404).json({code : 'notfound'})
      }
      result.remove()
      res.status(201).json({ code: "okay" });
    })
    .catch(next);
});

module.exports = router;