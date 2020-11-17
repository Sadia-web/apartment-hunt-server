const express = require('express');
const fileupload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;
const fs = require('fs-extra');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

//=========
const MongoClient = require('mongodb').MongoClient;
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.suep6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('services'));
app.use(fileupload());

//database connection


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const Apartmentcollection = client.db("Apartment-Hunt").collection("addHouse");
    console.log('databse connected')

     // add new house in databse
    app.post('/addHouse', (req, res) => {
        const file = req.files.file;
        const serviceTitle = req.body.serviceTitle;
        const location = req.body.location;
        const bedroom = req.body.bedroom;
        const birthroom = req.body.birthroom;
        const price = req.body.price;

        const newImg = file.data;
        const encImg = newImg.toString('base64');
        const houseImage = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        Apartmentcollection.insertOne({ serviceTitle, location, bedroom, birthroom, price, houseImage })
            .then(result => {

                res.send(result.insertedCount > 0)
            })
    })

      // load house data from database
    app.get('/loadHouse', (req, res) => {
        Apartmentcollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    //load single house data from db 
     app.get('/houseDetails', (req, res) => {
         console.log(req.query.ID)
        // Apartmentcollection.find({ _id: ObjectId(req.query.id) })
        //     .toArray((err, documents) => {
        //         res.send(documents[0])
        //     })
    })

  
    // perform actions on the collection object
    //databse closing
});




app.get('/', function (req, res) {
    res.send('Hey! I am woring properly right now')
})

app.listen(process.env.PORT || port)