const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const config = require('config');

AWS.config.update({
  accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
  secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
  region: config.get('region'),
});

const s3 = new AWS.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: 'jose-images-ecommerce',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

exports.uploadImage = upload;
