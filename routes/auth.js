'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/user');

router.get('/me', (req, res, next) => {
  if (req.session.currentUser) {
    res.json(req.session.currentUser);
  } else {
    res.status(404).json({ code: 'not-found' });
  }
});

router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).json({ code: 'validation' });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ code: 'not-found' });
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.json(user);
      } else {
        return res.status(404).json({ code: 'not-found' });
      }
    })
    .catch(next);
});

router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }

  const role = req.body.role;
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const password = req.body.password;
  const profession = req.body.profession;
  const address = req.body.address;
  const telephone = req.body.telephone;
  
  let icon = [];
  if(role === 'professional') {

    profession.forEach((element) => {
      switch (element) {
        case 'Web Developer':
          icon.push('laptop');
          break;
        case 'Designer':
          icon.push('laptop');
          break;
        case 'Photographer':
          icon.push('camera');
          break;
        case 'Chef':
          icon.push('nutrition');
          break;
        case 'Carpenter':
          icon.push('construct');
          break;
      }
    });
  }


  if (!name || !surname || !email || !password) {
    return res.status(422).json({ code: 'validation' });
  }

  User.findOne({ email }, 'email')
    .then(userExists => {
      if (userExists) {
        return res.status(422).json({ code: 'email-not-unique' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User({
        role,
        name,
        surname,
        email,
        profession,
        icon,
        address,   
        telephone, 
        password: hashPass
      });

      return newUser.save().then(() => {
        req.session.currentUser = newUser;
        res.json(newUser);
      });
    })
    .catch(next);
});

router.post('/logout', (req, res) => {
  req.session.currentUser = null;
  return res.status(204).send();
});

router.put('/:id/update', (req, res, next) => {
  const userId = req.params.id
  User.findByIdAndUpdate(userId, req.body.setup, {new: true})
  .then(result => {
    req.session.currentUser = result
    res.status(201).json({ code: 'okay' });
  })
  .catch(next)
})

module.exports = router;
