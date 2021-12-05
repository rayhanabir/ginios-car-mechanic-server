const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express()
const port =process.env.PORT || 5000;


//middelware

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acq7h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('carMechanic');
        const serviceCollection = database.collection('services');

        //get api

        app.get('/services', async (req, res)=>{
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.send(services);
        });

        //get api for single services

        app.get('/services/:id', async(req, res)=>{
            const id  = req.params.id;
            const query = {_id:ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.send(service)

        })

        //post api

        app.post('/services', async(req, res)=>{
            const service = req.body;
            console.log('hit the post api', service)
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        })

        //delete api 

        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await serviceCollection.deleteOne(query);
            res.send(result)
        })

    }
    finally{
        // await client.close();

    }

}
run().catch(console.dir)



app.get('/', (req, res)=>{
    res.send('runnig genius car server')
})

app.listen(port, ()=>{
    console.log(`running my port in ${port}`)
})