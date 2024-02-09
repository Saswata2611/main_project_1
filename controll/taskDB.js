const { query } = require('express');
const multer = require('multer');
const functions = require('../firbase-config');
const db =functions.db;
const storage = functions.storage;


const taskDB = db.collection('taskDB');
const mainDB = db.collection('mainDB');
const batchDB = db.collection('batchDB');
// Asign Work to users
const sendTaskFile =  async (req, res) => {
  try {
   
    const taskData = {
        task_Name:req.body.taskname,
        allocated_to:req.body.username,
        task_Description:req.body.description,
        task_file:req.file, // filename
        submitted_file:null,
        task_submittion_date:req.body.date,
        task_submitted_on:null,
        task_remarks:'Pending'
    };
    if(taskData.task_file == null){
        taskData.task_file = null;
        const docRef = await taskDB.add(taskData);
        const username =  taskData.allocated_to;
        const task_id = docRef.id;
        const date= new Date();
        const currentDate = date.toString();
        const uptoDate = {
            task_id:task_id,
            task_status:'Pending',
            updated_at:currentDate
        }
        
        let UserData = await mainDB.doc(username).get();
        if(UserData.exists){
         let updateData = await mainDB.doc(username).update(uptoDate);
         res.status(200).json(`Task has been assigned to ${username}`);
        }else{
            res.status(400).json(`There is no data of ${username}`);
        }
        
    }
    else if(taskData.task_file != null){
     // Upload the file to Firebase Storage
    const fileName = Date.now().toString(); // You can generate a unique filename
    const fileUpload = storage.file(fileName);
    const metadata = {
      metadata: {
        contentType: req.file.mimetype,
      },
    };
    await fileUpload.save(req.file.buffer, metadata);

    // Get the download URL
    const downloadURL = await storage.file(fileName).getSignedUrl({
      action: 'read',
      expires: '03-09-2100', // Set an expiration date if needed
    });
    // store ta file in firebase storage
    const fileMetadata = {
        name: req.file.originalname,
        type: req.file.mimetype,
        downloadURL: downloadURL[0],
      };
      // putting the task data into the taskDB
      const taskData = {
        task_Name:req.body.taskname,
        allocated_to:req.body.username,
        task_Description:req.body.description,
        task_file:fileMetadata.downloadURL,
        submitted_file:null,
        task_submittion_date:req.body.date,
        task_remarks:'Pending'
    };
        const docRef = await taskDB.add(taskData);
        const username =  taskData.allocated_to;
        const task_id = docRef.id;
        const date= new Date();
        const currentDate = date.toString();
        const uptoDate = {
            task_id:task_id,
            task_status:'Pending',
            updated_at:currentDate
        }
        
        let UserData = await mainDB.doc(username).get();
        if(UserData.exists){
         let updateData = await mainDB.doc(username).update(uptoDate);
         res.status(200).json(`Task has been assigned to ${username}`);
        }else{
            res.status(400).json(`There is no data of ${username}`);
        }
        
    }

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error Happend in the code' });
  }
};

// sending the tasks to the batches
const sendTaskFileToBatch =  async (req, res) => {
  try {
   
    const taskData = {
        task_name:req.body.taskname,
        allocated_to_batch:req.body.batch_name,
        task_Description:req.body.description,
        task_file:req.file, // filename
        submitted_file:null,
        task_submittion_date:req.body.date,
        task_submitted_on:null,
        task_remarks:'Pending'
    };
    if(taskData.task_file == null){
        taskData.task_file = null;
        const docRef = await taskDB.add(taskData);
        const batchname =  taskData.allocated_to_batch;
        const task_id = docRef.id;
        const uptoDate = {
            task_id:task_id,
            task_status:'pending',
        }
         let batchdata = await batchDB.doc(batchname).get();
         if(batchdata.exists){
              await batchDB.doc(batchname).update(uptoDate);
              const batchData = batchdata.data();
              const batch_users = await batchData.batchUsers;
              const length = batch_users.length;
              for(i = 0; i <= length-1; i++){
                  const user = batch_users[i];
                  await mainDB.doc(user).update(uptoDate);
              }
               res.status(200).json('Task Has Been Uploaded to the Batch Members');
         }
         else{
          res.status(400).json(`${taskData.allocated_to_batch} batch is not present in the Database`);
         }
    }
    else if(taskData.task_file != null){
     // Upload the file to Firebase Storage
    const fileName = Date.now().toString(); // You can generate a unique filename
    const fileUpload = storage.file(fileName);
    const metadata = {
      metadata: {
        contentType: req.file.mimetype,
      },
    };
    await fileUpload.save(req.file.buffer, metadata);

    // Get the download URL
    const downloadURL = await storage.file(fileName).getSignedUrl({
      action: 'read',
      expires: '03-09-2100', // Set an expiration date if needed
    });
    // store ta file in firebase storage
    const fileMetadata = {
        name: req.file.originalname,
        type: req.file.mimetype,
        downloadURL: downloadURL[0],
      };
      // putting the task data into the taskDB
      const taskdata = {
        task_name:req.body.taskname,
        allocated_to_batch:req.body.batch_name,
        task_Description:req.body.description,
        task_file:fileMetadata.downloadURL,
        submitted_file:null,
        task_submittion_date:req.body.date,
        task_remarks:'Pending'
    };
        const docRef = await taskDB.add(taskdata);
        const batchname =  taskData.allocated_to_batch;
        const task_id = docRef.id;
        const uptoDate = {
            task_id:task_id,
            task_status:'Pending'
        }
        
        let batchdata = await batchDB.doc(batchname).get();
        if(batchdata.exists){
          await batchDB.doc(batchname).update(uptoDate);
          const batchData = batchdata.data();
          const batch_users = await batchData.batchUsers;
          const length = batch_users.length;
          for(i = 0; i <= length-1; i++){
              const user = batch_users[i];
              await mainDB.doc(user).update(uptoDate);
          }
           res.status(200).json('Task Has Been Uploaded to the Batch Members');
     }
     else{
      res.status(400).json(`${taskdata.allocated_to_batch} batch is not present in the Database`);
     }
        
    }

  } catch (error) {
    console.log(error);
  }
}

// Submit the work by the user
const SubmitTaskFile = async(req, res)=>{
  try {
    const submitData = {
      task_id:req.body.task_id,
      task_file:req.file
  };
  const fileName = Date.now().toString(); // You can generate a unique filename
  const fileUpload = storage.file(fileName);
  const metadata = {
    metadata: {
      contentType: req.file.mimetype,
    },
  };
  await fileUpload.save(req.file.buffer, metadata);

  // Get the download URL
  const downloadURL = await storage.file(fileName).getSignedUrl({
    action: 'read',
    expires: '03-09-2100', // Set an expiration date if needed
  });
  // geting the date and time
  const date = new Date();
  const currentDate = date.toString();
  // store ta file in firebase storage
  const fileMetadata = {
      name: req.file.originalname,
      type: req.file.mimetype,
      downloadURL: downloadURL[0],
    };
  const uptoDate = {
      submitted_file:fileMetadata.downloadURL,
      task_submitted_on:currentDate,
      task_remarks:'Submitted'
  }
  
  const taskData = await taskDB.doc(submitData.task_id).get();
  const username = taskData.allocated_to;
  if(taskData.exists){
   await taskDB.doc(submitData.task_id).update(uptoDate);
   await mainDB.doc(username).update(uptoDate);
   res.status(200).json(`Task Submitted on ${currentDate} Successfully`);
  }
  else{
      res.status(400).json('Can not find the Task');
  }
  } catch (error) {
   console.log(error); 
  }
    
}
// search the tasks
const searchTaskById = async(req, res)=> {
try {
  const task_id = req.query.task_id;
  const taskData = await taskDB.doc(task_id).get();
  if(taskData.exists){
    res.status(200).json(taskData.data());
  }
  else{
    res.status(400).json('Sorry This Task does not exist in Data-Base');
  }
} catch (error) {
  console.log(error);
  res.status(404).json({ error: 'Error Happend in the code' });
}
}

// show all task at a time 
const ReadallTask = async(req, res)=> {
try {
  taskDB.get()
  .then((QuerySnapshot) => {
    let UserDataArr = [];
    QuerySnapshot.forEach((doc) => {
      UserDataArr.push(doc.data());
    });
    res.status(200).json(UserDataArr);
  });
} catch (error) {
  console.log(error)
  res.status(404).json({ error: 'Error Happend in the code' });
}
}
module.exports = { sendTaskFile, SubmitTaskFile, searchTaskById, ReadallTask,sendTaskFileToBatch };


