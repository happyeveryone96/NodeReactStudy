const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const { Subscriber } = require('../models/Subscriber');

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

router.post('/uploadVideo', (req, res) => {
  const video = new Video(req.body);
  video.save((err, doc) => {
    if (err) return res.json({ success: false, err})
    res.status(200).json({ success: true })
  })
})

router.get('/getVideos', (req, res) => {
  Video.find()
    .populate('writer')
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos});
    })
})

router.post('/getSubscriptionVideos', (req, res) => {
  // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
  Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec((err, subscribers)=> {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];

        subscribers.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo)
        })

        // 찾은 사람들의 비디오를 가지고 온다.
        Video.find({ writer: { $in: subscribedUser }})
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })
    })
})


router.post('/getVideoDetail', (req, res) => {
  Video.findOne({ '_id' : req.body.videoId })
    .populate('writer')
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err)
      return res.status(200).json({ success: true, videoDetail })
    })
})

router.post('/thumbnail', (req, res) => {
  let filePath = '';
  let fileDuration = '';
  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  })

  // 썸네일 생성
  ffmpeg(req.body.url)
  .on('filenames', function (filenames) {
    console.log('Will generate' + filenames.join(', '));
    console.log(filenames);

    filePath = 'uploads/thumbnails/' + filenames[0]
  })
  .on('end', function () {
    console.log('Screenshots taken');
    return res.json({ success: true, url: filePath, fileDuration: fileDuration})
  })
  .on('error', function (err) {
    console.log(err);
    return res.json({ success: false, err })
  })
  .screenshots({
    count: 3,
    folder: 'uploads/thumbnails',
    size: '320x240',
    filename: 'thumbnail-%b.png'
  })
})

module.exports = router;
