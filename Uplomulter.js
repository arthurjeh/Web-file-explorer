const express = require('express')
const multer = require('multer');


const app = express();

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
    if (!file) {
      const error = new Error('upload a file')
      return next(error)    //middleware
    }
      res.send("The images is upload")
    
  })


app.listen(3000, () => console.log('Server started on port 3000'))