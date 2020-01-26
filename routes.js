'use strict';

const express = require('express');
const router = express.Router();


// include express validator for data validation and destructure
const { check, validationResult } = require('express-validator');
// for hashing user passwords
const bcryptjs = require('bcryptjs');
// for parsing the user authentication header
const auth = require('basic-auth');

const User = require('./models').User;
const Course = require('./models').Course;


//error handler middleware for catching errors
function asyncHandler(cb){

    return async (req, res, next) => {
      try {
            await cb(req, res, next)
      } catch(err){ // handle promises that are rejected
            next(err);
        }
    }

}

/********  AUTHENTICATE USER  **********/
//modeled from Unit 9 REST API Authentication with Express lesson using auth and bcryptjs packages
const authenticateUser = async (req, res, next) => {
    let message = null; // initialize error message
    const users = await User.findAll();
    const credentials = auth(req);// get user's credentials from the request using "auth" package
    if (credentials) { // if the user enters credentials

      const user = users.find(user => user.emailAddress === credentials.name); // find user in database
        if (user) { // if the user exists, compare user's password to the entered password

            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);// compare passwords
              if (authenticated) { 
                 console.log(`Authentication successful for username: ${user.emailAddress}`);
                 req.currentUser = user; // if the user is authenticated, set it to current user
              } else {
                 message = `Authentication failure for username: ${user.emailAddress}`; // username error message
            }

        } else {
            message = `User not found for username: ${credentials.name}`; // not found error message
        }

    } else {
      message = 'Auth header not found';
    }

    if (message) { // if user cannot be authenticated send error status
      console.warn(message);
      res.status(401).json({ message: 'Access Denied' }); // return a response with a 401 unauthorized
    } else {
      next();
    }
  };



/****************  User Routes  *******************/

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req,res)=> {
    const authUser = req.currentUser; // set the authenticated user to the one we will search the db for by id

    const user = await User.findByPk(authUser.id, { // find the authenticated user in the db
        attributes: { 
            exclude: [ // do not display sensitive user info
                'password', 
                'createdAt', 
                'updatedAt'
            ] 
        },
    }); 
   
    if(user){ // if user exists
        res.status(200).json(user); // respond with 200 ok status and return the currently authenticated user
    } else {
        res.status(400).json({ message: "User not found" }); // else return 400 bad request status
    }


}));


// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', asyncHandler(async (req,res)=> {

    const errors = validationResult(req); // if email not valid log errors
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg); //map error messages
        res.status(400).json({ errors: errorMessages }); // set error status and send message
    
    } else { // else post new user
        const user = req.body; // set user to the request body

        if(user.password){
            user.password = bcryptjs.hashSync(user.password); //  hash password with bcrypjs
        }
    
        await User.create(req.body); // create new user
    
        res.status(201).location('/').end(); // respond with 201 no content and set location to  '/'
    
    }
   
}));




/****************  Course Routes  ****************/

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/courses', asyncHandler(async (req, res)=>{
    const courses = await Course.findAll( {
        attributes: { 
            exclude: [ // exclude the created and updated attributes
                'createdAt',
                'updatedAt'
            ] 
        },
        include: [ 
            {
                model: User, // display the user assigned to each course
                attributes: { // do not display sensitive user info
                    exclude: [
                        'password', 
                        'createdAt', 
                        'updatedAt'
                    ] 
                },
            },
        ],
    });
    res.json(courses);

}));


// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', asyncHandler(async (req, res)=>{

    const course = await Course.findByPk(req.params.id, {
        attributes: { 
            exclude: [  // exclude the created and updated attributes
                'createdAt',
                'updatedAt'
            ] 
        },
        include: [ 
           {
               model: User, // display the user assigend to the course
               attributes: { 
                exclude: [
                    'password', 
                    'createdAt', 
                    'updatedAt'
                ] 
            },
           },
       ],
   });    
   
    res.status(200).json(course); // send the course info to client

}));


// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', authenticateUser, asyncHandler(async (req, res)=>{

    const course =  await Course.create(req.body); // create the course given the req body info
    res.status(201).location('/courses/' + course.id).end(); // respond with 201 no content and set location to  '/course/:id' route

}));


// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', authenticateUser, [ //put won't throw error, so use express validator
    check('title') // check title value
        .exists()
        .withMessage('Please provide a value for "Title"'),
    check('description') // check description value
        .exists()
        .withMessage('Please provide a value for "Description"'),
    check('userId') // check userId value
        .exists()
        .withMessage('Please provide a value for "User Id"'),
] , asyncHandler(async (req, res, next)=> {
   
    const errors = validationResult(req); // after checks, create errors array if any exist

    if(!errors.isEmpty()){ // if errors array isn't empty handle them

        //  map through errors array to get a list of error messages
        const errorMessages = errors.array().map(error => error.msg);
        // set response to 400 and return the validation errors to the client
        res.status(400).json({ errors: errorMessages });

    } else { // otherwise update the course
        const authUser = req.currentUser; // set the authenticated user to a variable
        const course = await Course.findByPk(req.params.id); // find course via params

        // only allow the currently authenticated user to update their course
        if(authUser.id === course.userId){ 
            await course.update(req.body);
            res.status(204).end(); // for put request, send status code 204
        } else {
            res.status(403).json({message: "You may only make changes to your own courses"});
        }


    }

}));


// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res, next)=>{

    const authUser = req.currentUser; // set the authenticated user to a variable

    const course = await Course.findByPk(req.params.id); // find course via params

    if(course){
        
        // only allow the currently authenticated user to delete their course
        if(authUser.id === course.userId){ 

            await course.destroy(); // delete course from the database
            res.status(204).end(); // for delete request, send status code 204
        
        } else {
            res.status(403).json({message: "You may only make changes to your own courses"});
        }
    } else {
        next();
    }

}));


module.exports = router;
