'use strict';

const express = require('express');
// include express validator for data validation and destructure
const { check, validationResult } = require('express-validator');
// for hashing user passwords
const bcryptjs = require('bcryptjs');
// for parsing the user authentication header
const auth = require('basic-auth');
const router = express.Router();
const User = require('./models').User;
const Course = require('./models').Course;

/****************  User Routes  *******************/
router.get('/users',async (req,res)=> {
    const users = await User.findAll();
    res.json(users);
    // res.json({
    //     message: 'USERS GET ROUTE!',
    //   });
});


router.post('/users', (req,res)=> {
    res.json({
        message: 'USERS POST ROUTE WORKS!',
    });
    res.location('/');
    res.status(201).end();
});

/****************  Course Routes  ****************/
router.get('/courses', async (req, res)=>{
    const courses = await Course.findAll();
    res.json(courses);
    // res.json({
    //     message:'COURSES GET ROUTE'
    // });
});

router.get('/courses/:id', (req, res)=>{
    res.json({
        message:`COURSE ${req.params.id} GET ROUTE`
    });
});

router.post('/courses', (req, res)=>{
    res.json({
        message: 'COURSES POST ROUTE'
    });
});

router.post('/courses/:id', (req, res)=>{
    res.json({
        message:`COURSE ${req.params.id} POST ROUTE`
    });
});

router.put('/courses/:id', (req, res)=>{
    res.json({
        message:`COURSE ${req.params.id} PUT ROUTE`
    });
});

router.delete('/courses/:id', (req, res)=>{
    res.json({
        message:`COURSE ${req.params.id} DELETE ROUTE`
    });
});


module.exports = router;
