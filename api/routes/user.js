const express =require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const user = require('../model/user');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password,10,(err, hash) => {
        if(err)
        {
            return res.status(500).json({
                error: err
            })
        }
        else{
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: hash,
                email: req.body.email,
                userType: req.body.userType
            })
        user.save()
        .then(result => {
            res.status(200).json({
                new_user: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
        }
    })
})

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1)
        {
            return res.status(401).json({
                message: 'user not exist'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(!result)
            {
                res.status(401).json({
                    message: "password matchin failed"
                })
            }
            if(result)
            {
                const token = jwt.sign({
                    firstname:user[0].firstname,
                    lastname:user[0].lastname,
                    userType:user[0].userType,
                    email:user[0].email
                },
                'This is Dummy text',
                {
                    expiresIn: "24h"
                }
                );
                res.status(200).json({
                    firstname:user[0].firstname,
                    lastname:user[0].lastname,
                    userType:user[0].userType,
                    email:user[0].email,
                    token: token
                })
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.put('/change-password', (req, res, next) => {
    const { email, password, newpassword } = req.body;
  
    // Find the user by email
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        // Compare the current password with the stored hashed password
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error comparing passwords' });
          }
  
          if (!result) {
            return res.status(401).json({ message: 'Invalid current password' });
          }
  
          // Hash the new password
          bcrypt.hash(newpassword, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({ error: 'Error hashing password' });
            }
  
            // Update the user's password with the new hashed password
            user.password = hash;
            user.save()
              .then(() => {
                res.status(200).json({ message: 'Password changed successfully' });
              })
              .catch(err => {
                res.status(500).json({ error: 'Error saving user' });
              });
          });
        });
      })
      .catch(err => {
        res.status(500).json({ error: 'Error finding user' });
      });
  });
  
  


module.exports = router;