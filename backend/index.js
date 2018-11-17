var express = require('express');
var bodyParser = require("body-parser");
var mysql = require('mysql');

var app = express();

//database connection
var db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'',
    database: 'todoapp'
})

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log("database connected!!!");
});

//cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
//body-parser
app.use(bodyParser.json());  // to support json 
app.use(bodyParser.urlencoded({
    extended : true
}))                          // to support urlencoded

app.post("/todo", function(req, res){
    console.log(req.body.note);
    var note = req.body.note;
    var status = "N" ; //N = not completed
    db.query('insert into todolist(note,status) values("'+ note +'","'+ status +'")', function(error, results, fields){
        if(error){
            throw error;
        }
        res.send(200)
    })
})

app.get("/todo", function(req, res){
    db.query("select * from todolist" ,function(error, results ,fields){
        if(error){
            throw error;
        }
        res.send(JSON.stringify(results));
    })
})

app.get("/todo/:id", function(req, res){
    var id = req.params.id;
    db.query("select * from todolist WHERE id =? ", [id] ,function(error, results ,fields){
        if(error){
            throw error;
        }
        res.send(JSON.stringify(results));
    })
})

app.put("/todo/:id", function(req, res){
    var id = req.params.id;
    var status = "Y";
    //db.query("UPDATE todolist SET note = ? WHERE id= ?",[note ,id],function(err, result){
    db.query("UPDATE todolist SET status = ? WHERE id= ?",[status ,id],function(err, result){
        if(err){
            throw err;
        }
        res.send(result);
    })
})

app.delete("/todo/:id", function(req, res){
    var id  = req.params.id;
    db.query("DELETE FROM todolist WHERE id = ?",[id], function(err, result){
        if(err){
            throw err;
        }
        res.send(result);
    })
})

app.listen(3000);