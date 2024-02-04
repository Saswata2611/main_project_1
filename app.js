// adding the dependencies
const express = require('express');
const multer = require('multer');


// requiring the functions
//from mainDB
const InsertDataIntoMain = require('./routes/route');
const LoginUser = require('./routes/route');
const ReadDataByUsername  = require('./routes/route');
const ReadDataall = require('./routes/route');
const DeleteData = require('./routes/route');
const UpdateData  = require('./routes/route');
const ReadDataByrole = require('./routes/route');
//from taskDB
const searchTaskById = require('./routes/route');
const sendTaskFile = require('./routes/route');
const SubmitTaskFile = require('./routes/route');
const ReadallTask = require('./routes/route');
// from batchDB
const createBatch = require('./routes/route');
const addUsersToBatch = require('./routes/route');
// Initilizing the PORT & dependencies
const app = express();
const PORT = process.env.PORT || 1013;
const upload = multer({ storage: multer.memoryStorage() });

// Use this lines when you want to take user input from body and as a json file
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

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