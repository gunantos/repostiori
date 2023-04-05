require('dotenv').config();
var express = require('express');

var router = express.Router();
const speech = require('@google-cloud/speech');
const uploadFile = require('../middleware/upload');

router.post('/', async function(req, res, next) {
   const speechClient = new speech.SpeechClient();
   try {
      await uploadFile(req, res);
      if (req.file == undefined) {
         return res.status(400).send({ message: "Please upload a file!" });
      }
      const filePath = __basedir + "/public/upload/" + req.file.originalname;
      const file = fs.readFileSync(filePath);
      const audioBytes = file.toString('base64');
      const audio = {
         content: audioBytes
      };
      const config = {
         encoding: req.body.encoding || 'LINEAR16',
         sampleRateHertz: req.body.rate || 24000,
         languageCode: req.body.language || 'en-US'
      };
      const request = {
         audio,
         config
      };
      speechClient.recognize(request)
         .then((data) => {
            const results = _.get(data[0], 'results', []);
            const transcription = results
               .map(result => result.alternatives[0].transcript)
               .join('\n');
            console.log(`Transcription: ${transcription}`);
         })
         .catch(err => {
            res.status(500).send({
         message: `Could not upload the file:  ${err}`,
      });
         });
   } catch (err) {
       res.status(500).send({
         message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
   }
});

module.exports = router;
