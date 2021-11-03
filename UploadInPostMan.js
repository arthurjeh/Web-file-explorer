//______________USE POSTMAN_________________


//--------------Upload,delete a JSON file or rename a file ------
//this code can upload or delete or rename a jsonfile. We use different module to do this.


const express = require('express')    //express is use to create 
const multer = require('multer');     //multer is a middleware for handling a form data and principally use to upload a file
const fs=require('fs');               // fs is use to interact with a file
const formidable = require('formidable'); //formdiable is use for parsingform data,especially file uploads
const bodyParser = require('body-parser');  //Parse incoming request bodiesin a middleware before your handlers

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())



//-----------------disk storage ( constructor of multer)--------------

  const storage = multer.diskStorage({      
    destination: function (req, file, cb) {       //destination to the file
      cb(null, 'uploads')                         //the destination is a folder name uploads
    },
    filename: function (req, file, cb) {        //filename of the new file
      cb(null, ""+Date.now())                 //So the name of the file is only the date
    }
  })
  var upload = multer({ storage: storage }) //modify the upload variable





  //------------------Part of the code to uploading a file-----------
  //here we can uplaod a single file. That why we use upload.single

  //By default any function definded in JavScript is synchronous.
  //Here it's better to run this operation in background,while continuing the execution of the rest of the program
  //That's why we use async 


  //http://127.0.0.1:8080/uploadfile
  app.post('/uploadfile',upload.single('myFile'), async (req, res, next) => {       //upload to upload in particular directory
    const file = req.file           //recup the data of the file
    console.log(file)               //written the data 
    console.log(file.originalname)  //written the name of the file
  
    //create a error when the files is not recognised
    if (!file) {
      const error = new Error('upload a file')
      return next(error)    //middleware
    }
    const seeFile=JSON.parse(fs.readFileSync(file.originalname))     //parse the json file to see on the page. fs.readFileSync ise use to read the file and return its content
    res.send(seeFile)     //Return the json file
  })
//------------------------------------------------------





//-----------------Part of the code to delete a file-----------
//here we can delete a selected file
// called: http://127.0.0.1:8080/delete
app.post('/delete', (req, res, next) => {
    const form = formidable({ multiples: true });
  
    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      
      let fi=JSON.parse(fs.readFileSync(files.files.name))     //parse the json file to see on the page before its was deleted
      res.send(fi)
      const nameFile=files.files.name
      next()  
      
     fs.unlink(nameFile,function(){      //unlink can delete the file
     console.log(" the file names: "+nameFile+" was deleted")
     })
    });
  });
//------------------------------------



//-----------------Part of the code to rename a file-----------
//http://127.0.0.1:8080/rename

  app.post("/rename",(req,res)=>{
    var rename=req.body.rename      //the variable rename take the request of my text form
    console.log(rename)
    var toRename=req.body.toRename    //ake the request of the other text form
    console.log(toRename)
    fs.rename(toRename, rename, () => {         //fs.rename is use to rename the file. Here we have the variable toRename is the name of file taht we want to rename and rename is the new name 
    console.log("File Renamed!");
    });
     res.send("the file: "+toRename+" is now "+rename)        
  })



//----------Part to create a server-------------
const PORT=8080
app.listen(PORT, () => console.log('Server started on port : '+PORT))