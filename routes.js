'use strict';

const express = require('express');
// include express validator for data validation and destructure
const { check, validationResult } = require('express-validator');
// for hashing user passwords
const bcryptjs = require('bcryptjs');
// for parsing the user authentication header
const auth = require('basic-auth');
const router = express.Router();
// const User = require('../models').User;


/****************  User Routes  *******************/
router.get('/users', (req,res)=> {
    res.json({
        message: 'USERS GET ROUTE!',
      });
});


router.post('/users', (req,res)=> {
    res.json({
        message: 'USERS POST ROUTE WORKS!',
    });
    res.location('/');
    res.status(201).end();
});

/****************  Course Routes  ****************/
router.get('/courses', (req, res)=>{
    res.json({
        message:'COURSES GET ROUTE'
    });
});

router.get('/courses/:id', (req, res)=>{
    res.json({
        message:'INDIVIDUAL COURSE GET ROUTE'
    });
});

router.post('/courses', (req, res)=>{
    res.json({
        message: 'COURSES POST ROUTE'
    });
});

router.post('/courses/:id', (req, res)=>{
    res.json({
        message:'INDIVIDUAL COURSE POST ROUTE'
    });
});

router.put('/courses/:id', (req, res)=>{
    res.json({
        message:'INDIVIDUAL COURSE PUT ROUTE'
    });
});

router.delete('/courses/:id', (req, res)=>{
    res.json({
        message:'INDIVIDUAL COURSE DELETE ROUTE'
    });
});


module.exports = router;
