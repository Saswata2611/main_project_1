const { query } = require('express');
const multer = require('multer');
const functions = require('../firbase-config');
const db =functions.db;
const fs = require('fs');
const csv = require('csv-parser');

const tempDB = db.collection('tempDB');
const communityDB = db.collection('communityDB');


const uploadCSV = (csvFilePath) => {
try {
    if(!csvFilePath){
            console.error('CSV file path is undefined');
           return
    }
    else{
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      // Add each row to Firestore
      tempDB.add(row)
        .then((docRef) => {
          console.log('Document written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}
} catch (error) {
    console.log(error);
}
  };


  const csvdatatomainDB = async(req, res)=> {
    try {
        tempDB.get()
        .then((QuerySnapshot) => {
          QuerySnapshot.forEach((doc) => {
            const userData = doc.data(); // Get data of each document
            const excelData = {
              // collegeName: userData['College Name'],
              // email: userData.Email,
              // username: userData.Name,
              // phone_no: userData['Phone Number'],
              // year: userData.Year
              Name:userData.Name,
              email:userData.Email
            };
      
            // Add excelData to communityDB collection
            communityDB.add(excelData)
             
          });
          res.status(200).json('All Data TransFered');
        });
}
    catch(error){
    console.log(error);
    }
  } 
  module.exports = {uploadCSV, csvdatatomainDB};