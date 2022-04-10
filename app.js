const express = require("express")
const BodyParser = require("body-parser")

const app = express();

app.set("view engine", "ejs");  

app.use(BodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

let items = ['Buy food','Cook Food' ,'Eat Food']

app.get("/",function(req, res){
    
    // const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    // const d = new Date();
    // let day = weekday[d.getDay()];
    let today = new Date();
    // var options ={
    //     weekday: "long"
    // }
    let options ={
        weekday: "long",
        day : "numeric",
        month: "long"
    }
    
    let day = today.toLocaleDateString("en-US",options);

    res.render('list', {kindOfDay:day, newItems:items});
});


app.post("/",function(req, res){
    let item = req.body.newItem
    // console.log(newItem);
    // res.render('list',{items:newItem});
    items.push(item);
    res.redirect('/')
});


app.listen(3000, function(){
    console.log("Server started at port 3000");
})