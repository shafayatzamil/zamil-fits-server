const express = require('express');
require("colors")
const app= express();




app.listen(5000,()=>{
    console.log("server is running on port".cyan);
})