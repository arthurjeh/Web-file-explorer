//--------------Upload,delete a JSON file or rename a file ------
//this code can upload or delete or rename a jsonfile. We use different module to do this.


const express = require('express')    //express is use to create a post and get request
const multer = require('multer');     //multer is use to upload a file in particular directory
const fs = require('fs');               // fs is use to interact with a file. He is use to rename and read files
const formidable = require('formidable'); //formdiable is use for parsingform data,especially file uploads
const bodyParser = require('body-parser');  //Parse incoming request bodies in a middleware before your handlers
const { spawn } = require('child_process'); //child process provided the ability to spawn subprocesses. Here we use only spanw method because we want just to know when was the last modification


const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



//-----------------disk storage ( constructor of multer)--------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {       //destination to the file
    cb(null, 'uploads')                         //the destination is a folder name uploads
  },
  filename: function (req, file, cb) {        //filename of the new file
    cb(null, "" + Date.now())                 //So the name of the file is only the date
  }
})
var upload = multer({ storage: storage }) //modify the upload variable



//-----------get method-----------
//here the get method is use to see the form. Get is use here because we just want to get the client file
//By default any function definded in JavScript is synchronous.
//Here it's better to run this operation in background,while continuing the execution of the rest of the program
//That's why we use async 
app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/index.html');  //index.html is the back-end. So is useful to have the form

});



//------------------Part of the code to uploading a file-----------
//here we can uplaod a single file. That why we use upload.single



//uploadfile is called in the index.html. Uploadfile is the new url when the submit button is actived
app.post('/uploadfile', upload.single('myFile'), async (req, res, next) => {       //upload to upload in particular directory
  const file = req.file           //recup the data of the file
  console.log(file)               //written the data 
  console.log(file.originalname)  //written the name of the file

  //create a error when the files is not recognised
  if (!file) {
    const error = new Error('upload a file')
    return next(error)    //middleware
  }
  const seeFile = JSON.parse(fs.readFileSync(file.originalname))     //parse the json file to see on the page. fs.readFileSync ise use to read the file and return its content
  res.send(seeFile)     //Return the json file
})
//------------------------------------------------------




//-----------------Part of the code to delete a file-----------
//here we can delete a selected file
//deleted is called in the index.html
app.post('/delete', (req, res, next) => {
  const form = formidable({ multiples: true });   //use formidable to have the name and other data of the file 

  form.parse(req, (err, fields, files) => {   //We need to parse the json file to use it. files is my data of my file
    if (err) {
      next(err);
      return;
    }
    else {
      console.log(files)
      let fi = JSON.parse(fs.readFileSync(files.delete.name))     //parse the json file to see on the page before its was deleted
      res.send(fi)      //return the data
      next()          //The next() middleware is use to pass control to the next middleware function. Otherwise the request will remain blocked 
    }

    const path = fs.realpathSync(files.delete.name)    //find the directory of the file. For that we search the name of the filein the directory
    console.log("var to delete :" + path)
    next()

    fs.unlink(path, function () {      //unlink can delete the file
    console.log(" the file names in : " + path + " was deleted")
    })
  });
});

//-----------------Part of the code to rename a file-----------
//rename is called in the index.html

app.post("/rename", (req, res) => {
  var rename = req.body.rename      //the variable rename take the request of my text form
  console.log(rename)
  var toRename = req.body.toRename    //take the request of the other text form
  console.log(toRename)
  fs.rename(toRename, rename, () => {         //fs.rename is use to rename the file. Here we have the variable toRename is the name of file taht we want to rename and rename is the new name 
  console.log("File Renamed!");
  });
  res.send("the file: " + toRename + " is now " + rename)
})


//-----------------Part to search the last modification of a file------------
//directory is called in the index.html


app.post("/directory", (req, res) => {

  dir = req.body.directory    //retrieves the name of the file
  console.log(dir)

  const child = spawn('ls', ['-la']);    //list all filesincluding hidden

  child.stdout.on('data', data => {               //stdout=flow       on=listen
    console.log(`stdout:\n${data}`);    //i find now the data in my variable ${data}`
    const ar = (`${data}`)
    const find = ar.indexOf(dir)    //to find the location (nimber) of the file
    console.log(find)               // -1= don't find the name ----  other number= he find the name
    console.log(typeof (find))   //the type is a number (buffer)

    const number = ar.substr(find - 13, find / 36) // i delete the part that doesn't interest me (rights, name...)
    console.log(number)
    res.send("the file : " + dir + " was modified on " + number)
  });

})






//----------Part to create a server-------------
const PORT = 8081
app.listen(PORT, () => console.log('Server started on port : ' + PORT))