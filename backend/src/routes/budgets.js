const express = require('express');
const requireAuth = require('../middleware/auth');
const { getCategories, createCategory, updateBudget, getBudgetSummary } = require('../controllers/categoryController');

const router = express.Router();
router.use(requireAuth);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.patch('/categories/:id/budget', updateBudget);
router.get('/summary', getBudgetSummary);

module.exports = router;