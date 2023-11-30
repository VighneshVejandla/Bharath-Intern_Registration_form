const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const opn = require("opn")


const app = express ();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

//model of registration schema
const registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded ({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async (req, res) => {
    try{
        const {name, email, password} = req.body;

const existingUser = await registration.findOne({email : email });
//check for existing user
if(!existingUser) {
    const registrationData = new registration({
            name, 
            email,
            password,
        });
        await registrationData.save(); 
        res.redirect("/success");
    }
    else{
        console.log("User alreadyexist");
        res.redirect("/error");
    }


    }    
    catch (error) {
    console.log(error);
    res.redirect("error");

     }   
});

app.get("/success", (req, res)=>{
    res.sendFile (__dirname+"/pages/success.html");
})
app.get("/error", (req, res)=>{
    res.sendFile (__dirname+"/pages/error.html");
})

const connectAndStartServer = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://vighneshvejandla_2003:Vighnesh2003@Registartion-Form.hb3novf.mongodb.net/Registartion-Form?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Connected to MongoDB.");

        let serverStarted = false;

        app.listen(port, () => {
            if (!serverStarted) {
                console.log(`Server is running on port ${port}`);
                opn(`http://localhost:${port}`);
                serverStarted = true; 
              }
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
connectAndStartServer();
