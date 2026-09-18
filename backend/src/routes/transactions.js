const express = require('express');
const multer = require('multer');
const requireAuth = require('../middleware/auth');
const {
  getTransactions,
  createTransaction,
  updateTransactionCategory,
  deleteTransaction,
  uploadCsv,
} = require('../controllers/transactionController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv' && !file.originalname.toLowerCase().endsWith('.csv')) {
      return cb(new Error('Only CSV files are allowed'));
    }
    return cb(null, true);
  },
});

router.use(requireAuth);
router.get('/', getTransactions);
router.post('/', createTransaction);
router.post('/upload', upload.single('file'), uploadCsv);
router.patch('/:id/category', updateTransactionCategory);
router.delete('/:id', deleteTransaction);

module.exports = router;