// Connects to Mongo Database
var mongo = require('mongodb');
var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure,
ObjectID = mongo.ObjectID;
var server = new Server('troup.mongohq.com', 10017, {auto_reconnect: true});
db = new Db('coffeedb', server);


//Runs DB, if there is no data populates DB with Data
db.open(function(err, db) {
if(!err) {
db.authenticate('jamie','test', function(err){
if(!err){
console.log("Connected to 'coffeedb' database");
db.collection('coffees', {strict:true}, function(err, collection) {
if (err) {
console.log("The 'coffees' collection doesn't exist. Creating it with sample data...");
populateDB();
}else{}
})
}else{
console.log("AUTH FAIL!!!"+err)}});
}else{console.log("OPEN FAIL!!!"+err)}
});
//This function is only used once to populate the database with dummy data(used just for //testing)
var populateDB = function() {
var coffees = [
{
name: "Pure Gold",
beans: "Robusta",
brand: "Douwe Egbert",
description: "Douwe Egberts Pure Gold Coffee Sticks are perfect for individual servings. Each coffee stick is for one cup of delicious Coffee. Designed for ease of use. Made from a combination of powerful Robusta and aromatic Arabica beans. Designed to use minimal effort and ensure less wastage.",
picture: "a_pic.jpg"
},
{
name: "Rossa",
beans: "Arabica",
brand: "Lavazza",
description: "For those who want to get off to a great start, with all of the charge and energy coffee can offer.....",
picture: "a_pic.jpg"
}];
db.collection('coffees', function(err, collection) {
collection.insert(coffees, {safe:true}, function(err, result) {});
});
}; 


//HTTP Methods
//finds a coffee based on ID

exports.findById = function(req, res) {
var id = req.params.id;
console.log('Retrieving coffee: ' + id);
db.collection('coffees', function(err, collection) {
collection.findOne({'_id':new ObjectID(id)}, function(err, item) {
res.send(item);
});
});
};

//lists all coffees in collection

exports.findAll = function(req, res) {
db.collection('coffees', function(err, collection) {
collection.find().toArray(function(err, items) {
res.send(items);
});
});
};

//adds a Coffee to the DB

exports.addCoffee = function(req, res) {
var coffee = req.body;
console.log('Adding coffee: ' + JSON.stringify(coffee));
db.collection('coffees', function(err, collection) {
collection.insert(coffee, {safe:true}, function(err, result) {
if (err) {
res.send({'error':'An error has occurred'});
} else {
console.log('Success: ' + JSON.stringify(result[0]));
res.send(result[0]);
}
});
});
}

//Updates a Coffee based on ID

exports.updateCoffee = function(req, res) {
var id = req.params.id;
var coffee = req.body;
console.log('Updating coffee: ' + id);
console.log(JSON.stringify(coffee));
db.collection('coffees', function(err, collection) {
collection.update({'_id':new ObjectID(id)}, coffee, {safe:true}, function(err, result) {
if (err) {
console.log('Error updating coffee: ' + err);
res.send({'error':'An error has occurred'});
} else {
console.log('' + result + ' document(s) updated');
res.send(coffee);
}
});
});
}

//Deletes a Coffee based on ID

exports.deleteCoffee = function(req, res) {
var id = req.params.id;
console.log('Deleting coffee: ' + id);
db.collection('coffees', function(err, collection) {
collection.remove({'_id':new ObjectID(id)}, {safe:true}, function(err, result) {
if (err) {
res.send({'error':'An error has occurred - ' + err});
} else {
console.log('' + result + ' document(s) deleted');
res.send(req.body);
}
});
});
}