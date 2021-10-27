const express = require('express')
const multer = require('multer');
const fs=require('fs');
const formidable = require('formidable');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:true}))




app.use(express.json())


//disk storage ( constructor of multer)
  const storage = multer.diskStorage({      //multer is use for upload the file
    destination: function (req, file, cb) {//destination to the file
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {        //filename of the new file
      cb(null, ""+Date.now())
    }
  })
   
  var upload = multer({ storage: storage }) //modify the upload variable



app.get('/',async(req,res)=>{
    res.sendFile(__dirname + '/index.html');
  });
  
  app.post('/uploadfile',upload.single('myFile'), async (req, res, next) => {       //upload to upload in particular directory
    const file = req.file           //recup the data
    console.log(file)
    console.log(file.originalname)
  
    if (!file) {
      const error = new Error('upload a file')
      return next(error)    //middleware
    }
    const seeFile=JSON.parse(fs.readFileSync(file.originalname))     //parse the json file to see on the page
    res.send(seeFile)
    
  })



  app.post('/delete', (req, res, next) => {
    const form = formidable({ multiples: true });   //use formidable to have the name and other data of the file 
   
    form.parse(req, (err, fields, files) => {   //parse the json file
      if (err) {
        next(err);
        return;
      }
      else{
      let fi=JSON.parse(fs.readFileSync(files.delete.name))     //parse the json file to see on the page
      res.send(fi)
      next()          //middleware
    }

    const path=fs.realpathSync(files.delete.name)    //find the directory
      console.log(path)
      
     const toDelete=path
     console.log("var to delete :"+toDelete)
     next()
      
     fs.unlink(toDelete,function(){      //unlink can delete the file
     console.log("file deleted")
     })
    }); 
  });



app.post("/rename",(req,res)=>{
  var rename=req.body.rename
  console.log(rename)
  var toRename=req.body.toRename
  console.log(toRename)
  fs.rename(toRename, rename, () => {
  console.log("\nFile Renamed!\n");
  });
   res.send("file rename")
})



app.listen(8001, () => console.log('Server started on port 8001'))