//// @ts-nocheck

// import { v4 as uuidv4 } from "uuid";

// const {v4: uuidv4} = require ('uuid');

// console.log(uuidv4());

const express = require('express');
const mongoose = require('mongoose');
import Customer from './models/customers';
const cors = require('cors');
import {Request, Response} from 'express';


const app = express();
mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

// const customers =[
//     {
//         "name":"Simeon",
//         "industry":"technology"
//     },
//     {
//         "name":"Elizabeth",
//         "industry":"Nursing"
//     },
//     {
//         "name":"Ore",
//         "industry":"Medicine"
//     }
// ];


// const customer = new Customer({
//     name: 'John',
//     industry: 'marketing'
// });

app.get('/', (req: Request, res:Response)=>{
    res.send("Welcome!!")
});
app.get('/api/customers', async (req: Request, res:Response) => {
    //console.log(await mongoose.connection.db.listCollections().toArray());
    try{
        const result = await Customer.find();
        res.json({"customers": result})
    }catch(e) {
        res.status(500).json({error: e.message});
    }
});

app.get('/api/customers/:id', async(req: Request, res:Response) => {
    console.log({
        requestParams: req.params,
        requestQuery: req.query
    });
    try{
        const customerId = req.params.id;
        console.log(customerId); 
        const customer = await Customer.findById(customerId);
        console.log(customer);
        if(!customer){
            res.status(404).json({error:'User not found'});
        } else {
            res.json({customer});
        }
    } catch(e){
        res.status(500).json({error: 'something went wrong'})
    }
});


app.get('/api/orders/:id', async(req: Request, res:Response) => {
    try {
    const result = await Customer.findOne ({'orders._id': req.params.id});
        if (result){
            res.json(result)
        } else{
            res.status(404).json({error:'Order not found'});
        }
    }catch(e) {
        console.log(e.message);
        res.status(500).json({error:'something went wrong'});
    }
});


app.put('/api/customers/:id', async(req: Request, res:Response) => {
    try {
        const customerId = req.params.id;
        const customer = await Customer.findOneAndReplace({_id: customerId}, req.body, {new: true});
        console.log(customer);
        res.json({customer});
    }catch(e) {
        console.log(e.message);
        res.status(500).json({error:'something went wrong'});
    }
});

app.patch('/api/customers/:id', async(req: Request, res:Response) => {
    try {
        const customerId = req.params.id;
        const customer = await Customer.findOneAndUpdate({_id: customerId}, req.body, {new: true});
        console.log(customer);
        res.json({customer});
    }catch(e) {
        console.log(e.message);
        res.status(500).json({error:'something went wrong'});
    }
});

app.patch('/api/orders/:id', async(req: Request, res:Response) => {
    console.log(req.params);
    const orderId= req.params.id;
    req.body._id = orderId;
    try {
      const result = await Customer.findOneAndUpdate(
            {'orders._id': orderId}, 
            {$set: {'orders.$':req.body}},
            {new: true}
        );

        console.log(result);

        if (result){
            res.json(result)
        } else{
            res.status(404).json({error:'Order not found'});
        }
    }catch(e) {
        console.log(e.message);
        res.status(500).json({error:'something went wrong'});
    }
});

app.delete('api/customers/:id', async(req: Request, res:Response) =>{
    try{
        const customerId = req.params.id;
        const result = await Customer.deleteOne({_id: customerId});
        res.json({deletedCount: result.deletedCount});
    } catch(e) {
        res.status(500).json({error:"Something went wrong"});
    }
});

app.post('/api/customers', async(req: Request, res:Response) => {
    console.log(req.body);
    const customer = new Customer(req.body);
    try{
        await customer.save();
        res.status(201).json({customer});
    } catch(e){
        res.status(400).json({error: e.message})
    }
});

app.post('/', (req: Request, res:Response) => {
    res.send('This is a post request');
});

const start = async() => {
    try {
        await mongoose.connect(CONNECTION);

        app.listen(PORT, () => {
            console.log('App listening on port ' + PORT);
    });
  } catch(e) {
    console.log(e.message);
  }
};

start();