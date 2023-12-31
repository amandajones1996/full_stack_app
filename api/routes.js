const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const { User, Course } = require('./models');
const authUser = require('./middleware/authUser');

// Error Handler
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}

// User Routes
// Get All Users
router.get('/users', authUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  console.log("backend user", user)
  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
  });
}));

router.get('/usersList', asyncHandler(async (req, res) => {
  const users = await User.findAll();
  if (!users) {
    res.status(404).json({ message: "The users was not found" });
  } else {
    res.status(200).json(users);
  }
}));

// Create New User
router.post('/users', asyncHandler(async (req, res) => {
  try {
    let user = req.body
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, 10);
    }
    await User.create(user);
    res.status(201).location('/').end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(e => e.message)
      res.status(400).json({ errors });
    } else {
      throw error
    }
  }
}));

// Course Routes
// Get All Courses
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'emailAddress'] }]
  });
  if (!courses) {
    res.status(404).json({ message: "The course was not found" });
  } else {
    res.status(200).json(courses);
  }
}));

// Get Course By ID
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'emailAddress'] }]
  });
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({ message: "The course was not found" });
  }
}));

// Create New Course
router.post('/courses', authUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).location(`/courses/${course.id}`).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
      // res.status(400).json({ errors: error.errors.map(err => err.message) });
    } else {
      throw error
    }
  }
}));

// Update Course By ID
router.put('/courses/:id', authUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    res.status(404).json({ message: "The course was not found" });
  } else {
    if (course.userId != req.currentUser.id) {
      return res.status(403).json({ message: 'Failed authentication. Course could not be updated.' });
    } else {
      try{
        await course.update(req.body);
        res.status(204).end();
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          res.status(400).json({ errors: error.errors.map(err => err.message) });
        } else {
          throw error
        }
      }
    }
  }
}));

// Delete Course By ID
router.delete('/courses/:id', authUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    res.status(404).json({ message: "The course was not found" });
  }
  if (course.userId !== req.currentUser.id) {
    return res.status(403).json({ message: 'Course could not be deleted. Only owners may delete a course' });
  }
  await course.destroy();
  res.status(204).end();
}));

module.exports = router;