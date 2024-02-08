// adding the dependencies
const express = require('express');// Requied the express package
const multer = require('multer');//required the multer package for the file uplodation
const cors = require('cors');
// const bodyParser = require('body-parser');

// Initilizing the PORT & dependencies
const app = express();
const PORT = process.env.PORT || 1013;
const upload = multer({ storage: multer.memoryStorage() });

// Use this lines when you want to take user input from body and as a json file
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
// requiring the functions


//from mainDB
const InsertDataIntoMain = require('./routes/route');// route to insert data of all users
const LoginUser = require('./routes/route');//route of all user to login
const ReadDataByUsername  = require('./routes/route');// route to get all the data of the username
const ReadDataall = require('./routes/route'); // route to get all the data of all users
const DeleteData = require('./routes/route'); // route to delete any user data from database
const UpdateData  = require('./routes/route'); // route to update the role of the user
const ReadDataByrole = require('./routes/route');// route to get all the data by the user roles
//from taskDB
const searchTaskById = require('./routes/route'); // route to get the tasks by task ID
const sendTaskFile = require('./routes/route'); //route to 
const SubmitTaskFile = require('./routes/route');
const ReadallTask = require('./routes/route');
const sendTaskFileToBatch = require('./routes/route');
// from batchDB
const createBatch = require('./routes/route');
const addUsersToBatch = require('./routes/route');
const searchBatchByID = require('./routes/route');
const showAllBatchs = require('./routes/route');
const addFacultyToBatch = require('./routes/route');
const getUserName = require('./routes/route');


//  declearing the routes
app.post('/register', InsertDataIntoMain);

app.get('/login', LoginUser);
app.get('/read/username', ReadDataByUsername);
app.get('/read/role', ReadDataByrole);
app.get('/read', ReadDataall);
app.delete('/delete', DeleteData);
app.put('/update', UpdateData);
app.post('/upload', upload.single('filename'), sendTaskFile , (err, result)=>{
if(err) throw err;
});
app.post('/upload/submit', upload.single('filename'), SubmitTaskFile , (err, result)=>{
    if(err) throw err;
});
app.get('/searchtask', searchTaskById);
app.get('/all-task', ReadallTask);
app.post('/createbatch', createBatch);
app.post('/addusertobatch', addUsersToBatch);
app.post('/addFaculty', addFacultyToBatch);
app.get('/search-Batch-ByID', searchBatchByID);
app.get('/allBatch', showAllBatchs);
app.get('/allotetasktobatch', getUserName);
app.post('/uploadtobatch', sendTaskFileToBatch);
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