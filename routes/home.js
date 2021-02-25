require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require('path');
const mongoose = require("mongoose");

const memes = require('../model/meme');
const router = express.Router();
mongoose.Promise = Promise;
const app = express();
const methodOverride = require('method-override');
app.use(express.static("public"));
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

router.use(bodyParser.urlencoded({
    extended: true
}));
mongoose.connect('mongodb://localhost:27017/xmeme', { useNewUrlParser: true, useFindAndModify: false });
mongoose.set("useCreateIndex", true);

router.get('/', (req, res) => {
    res.redirect('/memes');
})
router.get('/memes', (req, res) => {
    memes.find({}, (err, foundmemes) => {
        if (err) {
            console.log(err);
        } else {
            // res.json(foundmemes);
            // console.log(foundmemes);
            res.render('index', { foundmemes: foundmemes });


        }
    }).sort({ _id: -1 }).limit(100);
});
router.post('/memes', (req, res) => {
    const newmeme = new memes({
        name: req.body.name,
        url: req.body.url,
        caption: req.body.caption
    });
    memes.findOne(newmeme, (err, found) => {
        if (err) {
            console.log(err);
        } else {
            if (found != null) {
                res.status(409).send('The meme with the following credentials is already published');
            } else {
                newmeme.save((err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200);
                        // res.setHeader('Content-Type', 'application/json');
                        // res.json(data);
                        res.redirect('/');
                    }
                });
            }
        }
    })

});
// router.post('/memes', (req, res) => {  // handles the post request upon the endpoint /memes
//     const { name, url, caption } = req.body;
//     const newMemes = new memes({ //creating new meme
//         name,
//         url,
//         caption
//     });
//     memes.findOne(req.body) //checking for duplicates
//         .then((data) => {
//             //console.log(data);
//             if (data !== null) {// duplicate meme exists
//                 res.sendStatus(409);
//             }
//             else {
//                 newMemes.save((err, data) => { // saving the newly created meme in database 
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         res.statusCode = 200;
//                         // res.setHeader('Content-Type', 'application/json');
//                         // res.json(data);
//                         res.render('index', { message: "Meme posted Successfully" });
//                     }
//                 });
//             }
//         })
//         .catch((err) => console.log(err));
// });
router.get('/memes/:id', (req, res) => {
    const id = req.params.id;
    memes.findOne({ _id: id }, (err, foundmeme) => {
        if (err) {
            console.log(err);
        } else {
            if (foundmeme) {
                // res.json(foundmeme);
                res.render('id_photo.ejs', { foundmeme: foundmeme });
            } else {
                res.sendStatus(404);
            }
        }
    })
})
router.get('/meme/:id', (req, res) => {
    const id = req.params.id;
    memes.findOne({ _id: id }, (err, foundmeme) => {
        if (err) {
            console.log(err);
        } else {
            if (foundmeme) {
                res.render('photo.ejs', { foundmeme: foundmeme });
            } else {
                res.sendStatus(404);
            }
        }
    })
})
router.patch('/memes/:id', (req, res) => {
    const id = req.params.id;
    const url = req.body.url;
    const caption = req.body.caption;
    memes.findByIdAndUpdate(id, { $set: { caption: caption, url: url } }, (err, updated) => {
        if (err) {
            console.log(err);
        } else {
            if (updated) {
                // res.json(updated);
                res.redirect('/');
            } else {
                res.status(404).send('Sorry, could not update the meme');
            }
        }
    });
});
module.exports = router;



