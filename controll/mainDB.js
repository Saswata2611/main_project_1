const { query } = require('express');
const functions = require('../firbase-config');
const db = functions.db;
const mainDB = db.collection('mainDB');
const taskDB = db.collection('taskDB');
// Inserting users in the Main DB
const InsertDataIntoMain = async(req, res)=> {
try {
  const UserID = req.query.username;
  const date= new Date();
  const currentDate = date.toString();
  const userData = {
    userName:req.query.username,
    userEmail:req.query.email,
    userPassword:req.query.password,
    userRole:req.query.role,
    userDesignation:req.query.designation,
    organization_name:req.query.organization_name,
    year:req.query.year,
    allocated_batch:null,
    permanent_id:null,
    task_id:null,
    join_date:req.query.joining_date,
    updated_at:currentDate
  };
  const registerUser = mainDB.doc(UserID).set(userData);
  res.status(200).json('User Registerd Sucessfully.');
} catch (error) {
  console.log(error);
}
}
// Loggin in of the user
const LoginUser = async(req, res)=> {
  try {
    const username = req.query.username;
    const password = req.query.password;
    let userdata = await mainDB.doc(username).get();
    if(userdata.exists){
        const DBpassword = userdata.data().userPassword;
        if(DBpassword == password){
           res.status(200).json('Welcome User');
        }else{
        res.status(400).json('Password is not matching with the Username');
    }
    }
    else{
        res.status(400).json('Username is not present in the Database');
    }
} catch (error) {
    console.log(error);
}
};
//  Reding the Data of the user for admin
//search By username
const ReadDataByUsername = async(req, res)=> {
try {
  const username = req.query.username;
  let userData = await mainDB.doc(username).get();
  if(userData.exists){
    res.status(200).json(userData.data());
  }
  else{
    res.status(400).json('Username Does not exist in the Data-Base');
  }
} catch (error) {
  console.log(error);
}
}

// show  all users at a time
const ReadDataall = async(req, res)=> {
  mainDB.get()
  .then((QuerySnapshot) => {
    let UserDataArr = [];
    QuerySnapshot.forEach((doc) => {
      UserDataArr.push(doc.data());
    });
    res.status(200).json(UserDataArr);
  })
}

// search by role
const ReadDataByrole = async(req, res)=> {
  try {
    const userRole = req.query.role;
    mainDB.get().then((QuerySnapshot)=> {
      let UserDataArr = [];
      QuerySnapshot.forEach((doc)=>{
        const user = doc.data();
        if(user.userRole == userRole){
          UserDataArr.push(doc.data());
        }
      });
      res.status(200).json(UserDataArr);
    });
  } catch (error) {
    console.log(error)
  }
  }

  
// Delete user data by the admin
const DeleteData = async(req, res)=>{
  try {
    const username = req.query.username;
    let userData = await mainDB.doc(username).get();
    if(userData.exists){
      const deleteData = await mainDB.doc(username).delete();
       res.status(200).json('Data Deleted Sucessfully');
    } 
    else{
      res.status(400).json('username does not exist in the database.');
    }
  } catch (error) {
    console.log(error);
}
}
//  updating the role of the user
const UpdateData = async(req, res)=> {
try {
  const username = req.query.username;
  const role = req.query.role;
  const date= new Date();
  const currentDate = date.toString();
  const uptoDate = {
    userRole:role,
    updated_at:currentDate
  }
  let UserData = await mainDB.doc(username).update(uptoDate);
  res.status(200).json('User Role Updated Sucessfully');
} catch (error) {
  console.log(error);
}
}
//exporting the functions to the app.js page
module.exports = {InsertDataIntoMain, LoginUser, ReadDataByUsername,ReadDataall, ReadDataByrole ,DeleteData, UpdateData};
