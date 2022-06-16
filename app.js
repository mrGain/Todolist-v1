const express = require("express")
const BodyParser = require("body-parser")
// const date = require(__dirname+"/date.js")
const mongoose = require("mongoose")
const _ = require("lodash")
const app = express();

app.set("view engine", "ejs");  

app.use(BodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect("mongodb+srv://admin:143@cluster0.hakdo0m.mongodb.net/todolistDB" ,{useNewUrlParser:true})

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

const ListSchema = {
    name:String,
    item : [itemSchema]
};

const List = mongoose.model('List',ListSchema)


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

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                //Create a new list
                const list = new List({
                    name:customListName,
                    item: defaultItem
                });
                list.save()
                res.redirect("/"+customListName)
            }else{
                // Show an exixting list
                res.render("list", {listTitle:foundList.name, newListitem:foundList.item})
            }
        }
    })

   
     
})


app.post("/",function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });
    if(listName === "Today"){
        item.save()
        res.redirect("/")
    }else{
        List.findOne({name:listName}, function(err, foundList){
            foundList.item.push(item);
            foundList.save();
            res.redirect("/"+listName)
        })
    }
   
   
});

app.post("/delete",function(req,res){
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItem, function(err){
            if(!err){
                console.log("Successfully deleted the item.")
                res.redirect("/")
            }
        });
    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {item: {_id: checkedItem}}}, function(err, foundList){
            if(!err){
                res.redirect("/"+listName)
            }
        });
    }
    
});

app.get("/work", function(req, res){
    res.render("list", {listTitle:"work List", newListitem:workItems})
});


app.listen(3000, function(){
    console.log("Server started at port 3000");
})