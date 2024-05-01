var express=require("express")
var bodyParser=require("body-parser")
var mongoose=require("mongoose")
const { MongoClient } = require('mongodb');
const fs = require('fs');
const app=express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/LearnEd')
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))


app.post("/signup",(req,res) => {
    var usr_name = req.body.usr_name
    var usr_pass = req.body.usr_pass
    var usr_mail = req.body.usr_mail

    var data={
        "userName":usr_name,
        "password":usr_pass,
        "Email":usr_mail
    }
    db.collection('users').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Record Inserted Succesfully")
    })
    return res.redirect('main.html')
})


app.post('/usrlog', async (req, res) => {
  var usr_name = req.body.username;
  var pass = req.body.password; 
  console.log(usr_name);
  console.log(pass);
  try {
    const user = await db.collection('users').findOne({ password:pass, userName:usr_name });
    
    if (user) {
      console.log("Access Given!");
      return  res.redirect('main.html');
    } else {
      alert('Invalid Credintials!');
      alert('Error');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get("/",(req,res) => {
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    return res.redirect('main.html');
}).listen(3000);

console.log("Listening on port 3000");