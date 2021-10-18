const express = require('express')
const router = express.Router()
const ratingController = require('../controllers/rating.controller');

// Retrieve all employees
router.get('/', ratingController.findAll);

// Create a new employee
router.post('/', ratingController.create);

// Retrieve a single employee with id
//router.get('/:id', employeeController.findById);

// Update a employee with id
//router.put('/:id', ratingController.like);

// Delete a employee with id
//router.delete('/:id', ratingController.remove);

module.exports = router