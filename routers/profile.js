const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const profileController = require('../controllers/profile');

const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  },
});
const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  dest: 'uploads/',
  limits: 1024 * 1024 * 2,
});

router.get('/:userId', isAuth, profileController.getMainData);

router.post('/image', upload.single('userImage'), (req) => {
  console.log(req.file);
});

router.patch(
  '/update',
  [
    body('id').isNumeric(),
    body('about').isString(),
    body('state').isNumeric(),
    body('city').isNumeric(),
    body('my_skills').isArray(),
  ],
  isAuth,
  profileController.updateProfileData
);

module.exports = router;
