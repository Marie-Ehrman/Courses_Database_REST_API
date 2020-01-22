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


//Middleware handler function for route callbacks
function asyncHandler(cb){

    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){ // handle promises that are rejected
            // if(error.name === "SequelizeValidationError") {
            //     res.status(400);
            //     res.json();
            // } else {
            //     next(error);
            // }
        res.status(500).send(error);
      }
    }

}

/********  AUTHENTICATE USER  **********/
//modeled from Unit 9 REST API Authentication with Express lesson using auth and bcryptjs packages
const authenticateUser = async (req, res, next) => {
    let message = null; // initialized error message
    const users = await User.findAll();
    const credentials = auth(req);// get user's credentials from the request using "auth" package
    if (credentials) { // the user enters credentials
      const user = users.find(user => user.emailAddress === credentials.name); // find user in database
        if (user) { // if the user exists compare user's password to the entered password
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
              if (authenticated) { // if the password matches, set the requests current
                 console.log(`Authentication successful for username: ${user.emailAddress}`);
                 req.currentUser = user; // if the user is authenticated, set it to current user
              } else {
                 message = `Authentication failure for username: ${user.username}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
      message = 'Auth header not found';
    }

    if (message) { // if user cannot be authenticated send error status
      console.warn(message);
      // Return a response with a 401 Unauthorized HTTP status code.
      res.status(401).json({ message: 'Access Denied' });
    } else {
      next();
    }
  };

/****************  User Routes  *******************/

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req,res)=> {
    const authUser = req.currentUser; // set the authenticated user to the one we will search the db for by id

    const user = await User.findByPk(authUser.id); // find the authenticated user in the db
   
    if(user){ // if user exists
        res.json(user); // return the currently authenticated user
        res.status(200); // respond with 200 ok status
    } else {
        res.status(400).json({ message: "User not found" }); // else return 400 bad request status
    }


}));


// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', asyncHandler(async (req,res)=> {

    const user = req.body; // set user to the request body

    if(user){
    user.password = bcryptjs.hashSync(user.password); // set the password to a hashed password

    await User.create(req.body); // create new user

    res.location('/');
    res.status(201).end();

    } else {
        res.status(400).json({ message: "User not found" }); // else return 400 bad request status

    }

}));




/****************  Course Routes  ****************/

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/courses', asyncHandler(async (req, res)=>{
    const courses = await Course.findAll( { // !!!!!!!need to figure out how to display user info.
         include: [ 
            {
                model: User,
            },
        ],
    });
    res.json(courses);

}));


// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', asyncHandler(async (req, res)=>{

    const course = await Course.findByPk(req.params.id);
    res.json(course);

}));


// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', authenticateUser, asyncHandler(async (req, res)=>{

    const course =  await Course.create(req.body);

    res.location('/courses/' + course.id);
    res.status(201).end();

}));


// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res)=>{
    const course = await Course.findByPk(req.params.id);

    if(course){
        await course.update(req.body);
        res.status(204).end();
    } else {
        res.status(400).json({ message: "Course not found" });
    }
    
}));


// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res)=>{
    const course = await Course.findByPk(req.params.id);

    if(course){
        await course.destroy();
        res.status(204).end();
    } else {
        res.status(400).json({ message: "Course not found" });

    }

}));


module.exports = router;
