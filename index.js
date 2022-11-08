const express = require('express');
const { MongoClient } = require('mongodb');
require("colors")
const app= express();


const uri = `mongodb://localhost:27017`;
const client= new MongoClient(uri);

async function dbConnect() {
    try {
      await client.connect();
      console.log("Database connected".yellow.italic);
    } catch (error) {
      console.log(error.name.bgRed, error.message.bold);
    }
  }
  dbConnect();


app.listen(5000,()=>{
    console.log("server is running on port".cyan);
})