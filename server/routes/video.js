const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");

let storage = multer.diskStorage({
    destination: (req, file, cb) => { 
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const esst = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true);
    }
})

const upload = multer({ storage: storage }).single("file");

const ffmpeg = require('fluent-ffmpeg');



//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => { //

    upload(req, res, err => { 
        if (err) {
            return res.json({ success: false, err });
        }

        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    })

})


router.post('/thumbnail', (req, res) => { //

    // 썸네일 생성 하고 비디오 러닝타임 가져오기

    let filePath = "";
    let fileDuration = '';

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata);
        console.log(meatadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '));
            console.log(filenames);

            filePath = 'uploads/thumbnails/' + filenames[0];
        })
        .on('end', function() {
            console.log('Screenshots taken')
            return res.json({ success: true, url: filePath, fileName: filenames, fileDuration: fileDuration })
            
        })
        .on('error', function() {
            console.log(err);
            return res.json({ success: false, err });
        })
        .screenshot({
            count: 3,
            folder: 'uploads/t/humbnails',
            size: '320x240',
            filename: 'thumbnail-/%b.png'
        })
})

module.exports = router;