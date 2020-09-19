const multer = require('multer');

// * File storage destination for inside the server
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === 'portfolioImage') {
//       cb(null, 'public/images/portfolio');
//     }
//     if (file.fieldname === 'userImage') {
//       cb(null, 'public/images/user');
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   },
// });

function fileFilter(req, file, cb) {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: 1024 * 1024 * 1,
});

module.exports = upload;
