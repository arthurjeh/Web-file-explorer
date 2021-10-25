const express = require('express')
const multer = require('multer');
const fs=require('fs');
const formidable = require('formidable');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:true}))




app.use(express.json())


//disk storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
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
      res.send("The images is upload")
    
  })



  app.post('/delete', (req, res, next) => {
    const form = formidable({ multiples: true });
   
    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      else{
      res.json({ fields, files });
    }
     const toDelete="./pictures/"+files.delete.name;
      console.log(toDelete)
      next()
      
      fs.unlink(toDelete,function(){
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
  
  function getCurrentFilenames() {
  console.log("Current filenames:");
  fs.readdirSync(__dirname).forEach(file => {
    console.log(file);
  });
  }
  res.send("file rename")
  
})




  
app.listen(8001, () => console.log('Server started on port 3000'))