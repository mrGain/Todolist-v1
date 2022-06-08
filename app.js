const express = require("express")
const BodyParser = require("body-parser")
// const date = require(__dirname+"/date.js")
const mongoose = require("mongoose")
const app = express();

app.set("view engine", "ejs");  

app.use(BodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/todolistDB" ,{useNewUrlParser:true})

const itemSchema = {
    name:String
};

const Item = mongoose.model("Item", itemSchema)
const item1 = new Item({
    name:"Welcome to yout todolist "
});
const item2 = new Item({
    name:"Hit the + button to add a new item."
});
const item3 = new Item({
    name:"<-- Hit this to delete an item."
});

const defaultItem = [item1, item2, item3];


app.get("/",function(req, res){
    
    // const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    // const d = new Date();
    // let day = weekday[d.getDay()];
    
    // var options ={
    //     weekday: "long"
    // }
    
    Item.find({},function(err,foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItem,function(err){
                if (err){
                    console.log(err)
                }else{
                    console.log("Successfully saved default items to DB")
                }
            });
            res.redirect("/")
        }else{
            res.render('list', {listTitle:"Today", newListitem:foundItems});
        }
    });
 
   
});


app.post("/",function(req, res){
    const itemName = req.body.newItem

    const item = new Item({
        name: itemName
    });
    item.save()

    res.redirect("/")
   
});

app.get("/work", function(req, res){
    res.render("list", {listTitle:"work List", newListitem:workItems})
});


app.listen(3000, function(){
    console.log("Server started at port 3000");
})