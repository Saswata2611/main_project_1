const { query, response, Router } = require('express');
const functions = require('../firbase-config');
const db = functions.db;
const mailDB = db.collection('mailDB');
const nodemailer = require('nodemailer');
const fs = require('fs');
const csv = require('csv-parser');

const uploadCSVformarketing = (csvFilePath) => {
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
           mailDB.add(row)
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
    
    
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: 'saswataghatak70@gmail.com',
      pass: 'gsik npsk ksxa upaz'
    }
  });
  
  async function getuserEmail(){
    const snapshot = await mailDB.get();
    const userEmails = [];
    snapshot.forEach(doc => {
      const email = doc.data().Email;
      userEmails.push(email);
    });
    return userEmails;
  };
  
  async function sendEmails(userEmails){
    const mailOption = {
      from: 'saswataghatak70@gmail.com',
      to:userEmails.join(', '),
      subject: 'Test Email',
      text: 'This is just a testing Mail '
    }
  
    try {
       await transporter.sendMail(mailOption);
    } catch (error) {
      console.log(error);
    }
  }
  
  const main = async(req, res)=> {
    try{
      const userEmail = await getuserEmail();
      await sendEmails(userEmail); 
      res.status(200).json('email sent');
    }
    catch(error){
      console.log(error);
    }
  }
  
  
module.exports = {main, uploadCSVformarketing};  