const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");
const multer = require('multer');

//=================================
//             Video
//=================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb({msg:'mp4 파일만 업로드 가능합니다.'}, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter }).single('file');

router.post('/uploadfiles', (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err})
    }
    return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
  })
})

module.exports = router;
