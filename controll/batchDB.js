const { query } = require('express');
const functions = require('../firbase-config');
const db = functions.db;
const admin = functions.admin;
const batchDB = db.collection('batchDB');
const mainDB = db.collection('mainDB');

const createBatch = async(req, res)=> {
try {
    
    const batchData = {
        batchName:req.query.batchname,
        batchMonth:req.query.month,
        batchCourse:req.query.course,
        batchUsers:null,
        batch_faculty:null,
        task_id:null,
        task_status:null, 
        startDate:req.query.date
    };
    const batchID = batchData.batchName;
    await batchDB.doc(batchID).set(batchData);
    res.status(200).json(`${batchID} has been created please add users.`);
} catch (error) {
    console.log(error);
}
}

const addUsersToBatch = async(req, res) => {
    try {
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
                await batchDB.doc(batch).update({
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
    } catch (error) {
        console.log(error)
    }
}
// add faculty to the batches
const addFacultyToBatch = async(req, res)=> {
   try {
    const addUSer = {
        username:req.query.faculty_name,
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
            await batchDB.doc(batch).update({
            batch_faculty: admin.firestore.FieldValue.arrayUnion(userName),
           }).then(
            await mainDB.doc(userName).update(batchalocate),
            res.status(200).json(`${addUSer.username} is added as Faculty to ${addUSer.batchID} batch`)
            ); 
        }
         else{
           res.status(400).json(`${batch} batch does not exist in Data-Base.`);
        }
     }else{
      res.status(400).json(`${userName} does not exist in Data-Base.`);
     }

   } catch (error) {
    console.log(error);    
   }
}
//showing the batch as per name
const searchBatchByID = async(req, res) => {
 try {
    const batchID  = req.query.batch_name;
    const BatchData = await batchDB.doc(batchID).get();
    if(BatchData.exists){
        res.status(200).json(BatchData.data());
    }else{
        res.status(400).json(`${batchID} does not exist in Data-Base`);
    }
 } catch (error) {
    console.log(error);
 }
}
// show all batches
const showAllBatchs = async(req, res)=> {
    try {
        batchDB.get()
        .then((QuerySnapshot) => {
          let UserDataArr = [];
          QuerySnapshot.forEach((doc) => {
            UserDataArr.push(doc.data());
          });
          res.status(200).json(UserDataArr);
        });
    } catch (error) {
        console.log(error);
    }
}
const DeleteBatch = async(req, res)=> {
    try {
        const batchName = req.query.name;
        const batch = await batchDB.doc(batchName).get();
        if(batch.exists){
            await batchDB.doc(batchName).delete();
            res.status(200).json('Batch Deleted Sucessfully');
        }else{
            res.status(400).json(`${batchName} batch does not exist in Data Base`);
        }
    } catch (error) {
        
    }
}
const deleteStudent = async(req, res)=> {
    try {
        const addUSer = {
            username:req.query.username,
            batchID:req.query.batch_name,
        }
        const batch = addUSer.batchID;
        const userName = addUSer.username;
        const batchalocate = {
            allocated_batch:null
        }
         const userfromdb = await mainDB.doc(userName).get();
         if(userfromdb.exists){
            const batchfromdb = await batchDB.doc(batch).get();
            if(batchfromdb.exists){
              await batchDB.doc(batch).update({
                batchUsers: admin.firestore.FieldValue.arrayRemove(userName),
              }).then(() => {
              res.status(200).json(`${userName} is removed as Student from ${batch} batch`);
              })
               await mainDB.doc(userName).update(batchalocate);
            }
             else{
               res.status(400).json(`${batch} batch does not exist in Data-Base.`);
            }
         }else{
          res.status(400).json(`${userName} does not exist in Data-Base.`);
         }
    } catch (error) {
        console.log(error)
    }
}
module.exports = {createBatch, addUsersToBatch, searchBatchByID, showAllBatchs, addFacultyToBatch, DeleteBatch, deleteStudent   };