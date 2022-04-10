const express = require("express")
const BodyParser = require("body-parser")

const app = express();

app.set("view engine", "ejs");  

app.use(BodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

let items = ['Buy food','Cook Food' ,'Eat Food']
let workItems = []
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

    res.render('list', {listTitle:day, newListitem:items});
});


app.post("/",function(req, res){
    console.log(req.body)
    let item = req.body.newItem
    if (req.body.list === "work"){
        workItems.push(item);
        res.redirect('/work')
    }else{
        items.push(item);
        res.redirect('/')
    }
    // console.log(newItem);
    // res.render('list',{items:newItem});
    
});

app.get("/work", function(req, res){
    res.render("list", {listTitle:"work List", newListitem:workItems})
});


app.listen(3000, function(){
    console.log("Server started at port 3000");
})