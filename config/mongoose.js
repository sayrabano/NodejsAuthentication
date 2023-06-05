// required library
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/codeial_development');

// connecting to databse on mongodb cloud
mongoose.connect('mongodb+srv://sayrabano8888:lZwnVwnXe7OrlRN5@cluster0.ebxvdye.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser:true
})

// establishing connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

// opening connection
db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

// exporting db
module.exports = db;