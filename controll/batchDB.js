const { query } = require('express');
const functions = require('../firbase-config');
const db = functions.db;
const admin = functions.admin;
const batchDB = db.collection('batchDB');
const mainDB = db.collection('mainDB');

const createBatch = async(req, res)=> {
    const batchID = req.query.name;
    const batchData = {
        batchName:req.query.name,
        batchMonth:req.query.month,
        batchCourse:req.query.course,
        batchUsers:null,
        userRole:null,
        startDate:req.query.date
    };
    const batch = batchDB.doc(batchID).set(batchData);
    res.status(200).json(`${batchID} has been created please add users.`);
}

const addUsersToBatch = async(req, res) => {
    const addUSer = {
        username:req.query.username,
        batchID:req.query.batch_name,
    }
    const batch = addUSer.batchID;
    const userName = addUSer.username;
    const batchalocate = {
        allocated_batch:batch
    }
     const userfromdb = await mainDB.doc(userName).get();
     if(userfromdb.exists){
        const batchfromdb = await batchDB.doc(batch).get();
        if(batchfromdb.exists){
           const batchtochange = await batchDB.doc(batch).update({
            batchUsers: admin.firestore.FieldValue.arrayUnion(userName),
           }).then(
            res.status(200).json(`${addUSer.username} is added to ${addUSer.batchID} batch`)
            );
           const user = await mainDB.doc(userName).update(batchalocate);
        }
         else{
           res.status(400).json(`${batch} batch does not exist in Data-Base.`);
        }
     }else{
      res.status(400).json(`${userName} does not exist in Data-Base.`);
     }
}

module.exports = {createBatch, addUsersToBatch};