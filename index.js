const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3030;

app.listen(port,()=>{
    console.log("hello");
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

let database = require('./controlerDB');
//method post create account
app.post('/createAcount',async (req,res)=>{

    //console.log(newuser);
     let result = await database.createAccount(req.body);
    if(result === true)
    {
        req.session.user = req.body.username;
        req.session.save();
    }
   
    res.json({status:result});
});
//method post login 
app.post('/login',async (req,res)=>{
    console.log(req.body);
    if(req.session.user)
    {
        res.json({
			success: true
		});
        console.log("dang nhap lawm ther"+req.session.user);
        return;
    }
    
     let result = await database.login(req.body);
    
    if(result.user)
    {
        //create session login 
		req.session.user = result.user;
        console.log(result.user+" da dang nhap!!!");
        
		req.session.save();
        console.log(req.session);
 
    res.json({
			success: true
		});
    }
    else
        res.json({
			    success: false
		});
   
});


app.get("/getstatus",(req,res)=>{
console.log(req.session.user+" function");
    if(req.session.user)
    {
        console.log(req.session.user);
        res.json({login:true});
    }
    else
    res.json({login:false});
    
});




app.post("/newlesson", async (req,res)=>{
    if(req.session.user)
    {
        console.log(req.session.user);
        let data = {...req.body,user:req.session.user};
        const result  = await database.newlesson(data);
        res.json({result});
    }
else
    res.json({status:"login"});
    
});

app.get("/alllesson", async (req,res)=>{
   let name = req.session.user;
    console.log("get data "+req.session.user);
    if(req.session.user)
    {

        let result = await database.getalllesson(req.session.user);  
        res.json(result);
        
    }
else
    res.json({success:false});
    

});

app.post('/deletelessonbyid',async(req,res)=>{
    if(req.session.user)
    {
        console.log(" body "+req.body.idlesson);
        if(req.body)
        {
            
            let result = await database.deletelessonbyid(req.body.idlesson);  
            console.log(result);
            res.json(result);
        }
    }
    else
    {
        res.json({success:false});
    }

});


app.get("/logout",(req,res)=>{
    
    console.log(req.session.user +" da dang xuat!!!!");
    req.session.destroy();
    
    res.json({success:true});
});

app.get('/getpubliclesson',async (req,res)=>{
   

        let result = await database.getalllesson('vantuhym');  
        res.json(result);

});

app.post("/getlessonbyid",async (req,res)=>{
     if(req.body.id)
     {
        let result = await database.getlessonbyid(req.body.id);
        if(result.err)
        {
            res.json({message:"error"});
        }else
        {
            //console.log(result);
            res.json(result);
        }
     }
        else res.json({message:"error"});

});

app.post('/updatelesson',async(req,res)=>{
    if(req.session.user)
    {
        let result = await database.updatelesson(req.body);
        console.log(result);
        res.json(result);
    }
});

app.post('/updatecard',async(req,res)=>{
    if(req.session.user)
    {
        let result = await database.updatecard(req.body);
        res.json(result);
    }
});
app.get('*', function(req, res){
  res.redirect('/');
});



