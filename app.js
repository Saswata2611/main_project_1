// adding the dependencies
const express = require('express');// Requied the express package
const multer = require('multer');//required the multer package for the file uplodation
const cors = require('cors'); //required the cors package to set the cors policy
const bodyParse = require('body-parser'); // required the body-parser package

// Initilizing the PORT & dependencies
const app = express();// intialiased the express package in app
const PORT = process.env.PORT || 1013; // initialised the port for  my application
const upload = multer({ storage: multer.memoryStorage() });//call multer memory storage in upload variable

// Use this lines when you want to take user input from body and as a json file
app.use(bodyParse.json()); // intialised bodyparse dependency to fetch the json data into body format
app.use(bodyParse.urlencoded({extended: true}));// intialised the bodyparser to encode the url inputs
app.use(cors());// intialise the corse to my application
// requiring the functions


//from mainDB
const InsertDataIntoMain = require('./routes/route');// route to insert data of all users
const LoginUser = require('./routes/route');//route of all user to login
const ReadDataByUsername  = require('./routes/route');// route to get all the data of the username
const ReadDataall = require('./routes/route'); // route to get all the data of all users
const DeleteData = require('./routes/route'); // route to delete any user data from database
const UpdateData  = require('./routes/route'); // route to update the role of the user
const ReadDataByrole = require('./routes/route');// route to get all the data by the user roles
const ChangeThePassword = require('./routes/route');// route to change the user password
//from taskDB
const searchTaskById = require('./routes/route'); // route to get the tasks by task ID
const sendTaskFile = require('./routes/route'); //route to send task file to the users or the students individually
const SubmitTaskFile = require('./routes/route'); // route to submit task by the user which users are allocated
const ReadallTask = require('./routes/route');// route to read the tasks present in the Database
const sendTaskFileToBatch = require('./routes/route');// route to upload task into the batches and this file will be updated to the users database present in batch
// from batchDB
const createBatch = require('./routes/route');//route to create a new batch
const addUsersToBatch = require('./routes/route'); // route to add users to the batch
const searchBatchByID = require('./routes/route'); //route to search a batch  by its name or ID
const showAllBatchs = require('./routes/route');// route to show all the batches present in the Database
const addFacultyToBatch = require('./routes/route');//route to allocate faculty to the batches
const DeleteBatch= require('./routes/route');
const deleteStudent = require('./routes/route');
//  declearing the routes
app.post('/register',cors(), InsertDataIntoMain);// endpoint of user register
app.get('/login', LoginUser);// endpoint of login of the user
app.get('/read/username', ReadDataByUsername);// endpoint for searching a user data by his name
app.get('/read/role', ReadDataByrole);//endpoint for  searching the users name by there role
app.get('/read', ReadDataall);// endpoint for reading all the data present in the main Database
app.delete('/delete', DeleteData);//endpoint to delete any data of user
app.post('/update', UpdateData);//endpoint to update a user role 
app.post('/upload', upload.single('filename'), sendTaskFile , (err, result)=>{
if(err) throw err;
});// endpoint to send taskfile to the users individually
app.post('/upload/submit', upload.single('filename'), SubmitTaskFile , (err, result)=>{
    if(err) throw err;
});// endpoint to submit the task by the users
app.get('/searchtask', searchTaskById);// endpoint to search the tasks by the task id
app.get('/all-task', ReadallTask);
app.post('/createbatch', createBatch);
app.post('/addusertobatch', addUsersToBatch);
app.post('/addFaculty', addFacultyToBatch);
app.get('/search-Batch-ByID', searchBatchByID);
app.get('/allBatch', showAllBatchs);
app.post('/uploadtobatch', upload.single('filename'), sendTaskFileToBatch, (err, result)=>{
    if(err) throw err;
});
app.put('/update/password', ChangeThePassword);
app.delete('/deletebatch', DeleteBatch);
app.delete('/deletestudent', deleteStudent);



// starting the server
const start = async()=> {
    try {
        app.listen(PORT, ()=>{
            console.log(`your api url is http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}
start();