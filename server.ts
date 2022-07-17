import { config } from 'dotenv';
config();
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors';
import { writeFileSync } from 'fs';
import path from 'path'
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import multer from 'multer'

const greenlock = require('greenlock-express');

const upload = multer()

const prisma = new PrismaClient();

const app = express()

app.use(bodyParser.json());

app.use(cors());

app.use(express.static(__dirname + '/website/build'))

app.get('/latest', async (req, res) => {
    const data = await prisma.dataPoint.findMany({
        orderBy: {
            timestamp: 'desc'
        },
        distinct: ['device'] 
    })
    res.send({data})
})

app.get('/history', async (req, res) => {
    const { device } = req.query;
    if(!device) res.send({error: "No device specified"})
    const data = await prisma.dataPoint.findMany({
        where: {
            device: device as string
        },
        orderBy: {
            timestamp: 'desc'
        }
    })
    res.send({data})
})

app.post('/inlet', async (req, res) => {
    if(req.body.pwd == process.env.PWD_SECRET){
        //Log data
        const timestamp = new Date();

        let data = Object.keys(req.body.data).map((x) => {
            return {
                device: x,
                value: req.body.data[x],
                timestamp: timestamp,
                id: nanoid()
            }
        })

        await prisma.dataPoint.createMany({
            data
        })

        res.send({success: true})
    }
})

app.get('/insight.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, './insight.jpg'))
})

app.post('/insight', upload.single('insight'), async (req, res) => {
    if(req.body.pwd == process.env.PWD_SECRET){
        writeFileSync(path.join(__dirname, './insight.jpg'), req.file?.buffer || '')
        res.send({success: true})
    }
})

if(process.env.NODE_ENV == 'production'){
    console.log("Serving with HTTPS")
    greenlock.init({
        packageRoot: __dirname,
        configDir: './greenlock.d',
        maintainerEmail: process.env.MAINTAINER_EMAIL,
        cluster: false
    }).serve(app);
}else{
    console.log("Serving on 8080")
    app.listen(8080);
}

