const express = require("express"); // reuired the express package here
const router = express.Router(); // parsed the Router package from express

// // requiring the functions of the mainDB controll page
const {InsertDataIntoMain, LoginUser, ReadDataByUsername, ReadDataall , ReadDataByrole, DeleteData, UpdateData, ChangeThePassword, sendNotification, readnotification} = require('../controll/mainDB');
const {sendTaskFile,SubmitTaskFile, searchTaskById, ReadallTask, sendTaskFileToBatch} = require('../controll/taskDB');
const {createBatch, addUsersToBatch, searchBatchByID, showAllBatchs, addFacultyToBatch, DeleteBatch, deleteStudent} = require('../controll/batchDB');
const {main, uploadCSVformarketing} = require('../controll/mailBB');
const {csvdatatomainDB} = require('../controll/communityDB');
router.route('/register').post(InsertDataIntoMain);
router.route('/login').get(LoginUser);
router.route('/read/username').get(ReadDataByUsername);
router.route('/read/role').get(ReadDataByrole);
router.route('/read').get(ReadDataall);
router.route('/delete').delete(DeleteData);
router.route('/update').post(UpdateData);
router.route('/mailall').post(main);
router.route('/update/password').put(ChangeThePassword);
router.route('/notify').post(sendNotification);
router.route('/readnotification').get(readnotification)
//requiring the functions of the taskDB controll page
router.route('/upload').post(sendTaskFile);
router.route('/upload/submit').post(SubmitTaskFile);
router.route('/searchtask').get(searchTaskById);
router.route('/all-task').get(ReadallTask);
router.route('/uploadtobatch').post(sendTaskFileToBatch);
// requiring the fuctions of the batchDB controll page
router.route('/createbatch').post(createBatch);
router.route('/addusertobatch').post(addUsersToBatch);
router.route('/search-Batch-ByID').get(searchBatchByID);
router.route('/allBatch').get(showAllBatchs);
router.route('/addFaculty').post(addFacultyToBatch);
router.route('/deletebatch').delete(DeleteBatch);
router.route('/deletestudent').delete(deleteStudent);
//requiring the function of the communityDB controll page
router.route('/uploadcsvdata').post(csvdatatomainDB);

module.exports = router;