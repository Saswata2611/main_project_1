const express = require("express"); // reuired the express package here
const router = express.Router(); // parsed the Router package from express

// // requiring the functions of the mainDB controll page
const {InsertDataIntoMain, LoginUser, ReadDataByUsername, ReadDataall , ReadDataByrole, DeleteData, UpdateData} = require('../controll/mainDB');
const {sendTaskFile,SubmitTaskFile, searchTaskById, ReadallTask} = require('../controll/taskDB');
const {createBatch, addUsersToBatch, searchBatchByID, showAllBatchs, addFacultyToBatch} = require('../controll/batchDB')
router.route('/register').post(InsertDataIntoMain);
router.route('/login').get(LoginUser);
router.route('/read/username').get(ReadDataByUsername);
router.route('/read/role').get(ReadDataByrole);
router.route('/read').get(ReadDataall);
router.route('/delete').delete(DeleteData);
router.route('/update').put(UpdateData);
//requiring the functions of the taskDB controll page
router.route('/upload').post(sendTaskFile);
router.route('/upload/submit').post(SubmitTaskFile);
router.route('/searchtask').get(searchTaskById);
router.route('/all-task').get(ReadallTask);
// requiring the fuctions of the batchDB controll page
router.route('/createbatch').post(createBatch);
router.route('/addusertobatch').post(addUsersToBatch);
router.route('/search-Batch-ByID').get(searchBatchByID);
router.route('/allBatch').get(showAllBatchs);
router.route('/addFaculty').post(addFacultyToBatch);
module.exports = router;