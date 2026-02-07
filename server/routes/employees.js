const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// @route   GET /api/employees
// @desc    Get all employees (with optional search/filter)
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { query, status, dept } = req.query;
        let searchCriteria = {};

        // Search by Name, Code, or Phone
        if (query) {
            searchCriteria.$or = [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { employeeId: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ];
        }

        // Filter by Status
        if (status && status !== 'All') {
            searchCriteria.status = status;
        }

        // Filter by Department
        if (dept && dept !== 'All') {
            searchCriteria.department = dept;
        }

        const employees = await Employee.find(searchCriteria).sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/employees/:code
// @desc    Get single employee by Employee Code or MongoDB ID
// @access  Private
router.get('/:code', async (req, res) => {
    try {
        let employee = await Employee.findOne({ employeeId: req.params.code });
        if (!employee) {
            // Try by ID if code not found
            if (req.params.code.match(/^[0-9a-fA-F]{24}$/)) {
                employee = await Employee.findById(req.params.code);
            }
        }

        if (!employee) return res.status(404).json({ msg: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/employees
// @desc    Add new employee
// @access  Private
router.post('/', async (req, res) => {
    try {
        // Check if employee exists
        let existingEmp = await Employee.findOne({ $or: [{ employeeId: req.body.employeeId }, { email: req.body.email }] });
        if (existingEmp) {
            return res.status(400).json({ msg: 'Employee already exists with this Code or Email' });
        }

        const newEmployee = new Employee(req.body);
        const employee = await newEmployee.save();
        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/employees/:code
// @desc    Update employee by Code
// @access  Private
router.put('/:code', async (req, res) => {
    try {
        let search = { employeeId: req.params.code };

        // Update fields
        const employee = await Employee.findOneAndUpdate(
            search,
            { $set: req.body },
            { new: true }
        );

        if (!employee) return res.status(404).json({ msg: 'Employee not found' });

        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/employees/:code/status
// @desc    Update employee status (Left/Rejoin)
// @access  Private
router.put('/:code/status', async (req, res) => {
    try {
        const { status, exitDetails, rejoinDate, reason } = req.body;
        let updateData = { status };

        if (status === 'Inactive' || status === 'Terminated' || status === 'On Leave') {
            updateData.exitDetails = exitDetails;
        } else if (status === 'Active') {
            // Handling Rejoin
            updateData.exitDetails = null; // Clear exit details
            // Potentially add to timeline or update joining date if needed, keeping simple for now
        }

        const employee = await Employee.findOneAndUpdate(
            { employeeId: req.params.code },
            { $set: updateData },
            { new: true }
        );

        if (!employee) return res.status(404).json({ msg: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee (Hard Delete)
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        await Employee.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Employee removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
