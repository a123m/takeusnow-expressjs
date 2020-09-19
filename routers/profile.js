const express = require('express');
const { body, param } = require('express-validator');

const upload = require('../utils/multer.config');
const isAuth = require('../middleware/is-auth');

const profileController = require('../controllers/profile');

const router = express.Router();

router.get('/:userId', isAuth, profileController.getMainData);

router.post(
  '/portfolio/:userId',
  [param('userId')],
  upload.single('portfolioImage'),
  isAuth,
  profileController.portfolioUpload
);

router.delete(
  '/portfolio/:portfolioId',
  isAuth,
  profileController.portfolioDelete
);

router.post(
  '/userimage/:userId',
  upload.single('userImage'),
  isAuth,
  profileController.userImageUpload
);

router.patch(
  '/:userId',
  isAuth,
  [body('about').isString()],
  profileController.updateProfileData
);

module.exports = router;
