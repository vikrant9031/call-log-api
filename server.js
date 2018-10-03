const express =require('express');
const knex=require('knex');
const bcrypt =require('bcrypt-nodejs');

const bodyParser=require('body-parser');
const cors=require('cors');

var fileUpload =require('express-fileupload');




 const postgres=knex ({
    client: 'pg',
    connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'vikrant',
    database : 'signin'
  }
});

// const database={
// 	users:[
//        {
//        	name:'vikrant',
//        	email:'vikrantsingh769@gmail.com',
//        	password:'vikrant'
//        }
// 	]
// }
const app =express();

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use('/public',express.static(__dirname + '/public'));
 



 app.get('/',function(req,res){
	res.send("welcome");
});
app.post('/register',(req,res)=>{
	const{email,password}=req.body;
	postgres.insert({email:email,password:password}).into('signindata').returning('*')
	.then(data=>{
		res.json("successfully")
		console.log("successfully inserted");
	})
})

app.post('/contact',(req,res)=>{
	const{name,company,work,mobile,email}=req.body;
	postgres.insert({name:name,company:company,work:work,mobile:mobile,email:email}).into('contact').returning('*')
	.then(data=>{
		res.json("successfully")
		console.log("successfully inserted");
	})
})


app.post('/info',(req,res)=>{
	postgres.select('*').from('contact')
	.then(data=>{
		res.json(data)
		console.log(data);
	})
})

app.post('/upload',(req,res)=>{
	console.log(req);
	var dj = req.files.file;
	name = dj.name;
	dj.mv(`${__dirname}/public/${name}`,function(err){
 if(err){
 	return res.status(400).send(err);
 }else{
 	res.json({file: `public/${name}`})
 }

	});
})

app.post('/signin',(req,res)=>{
   const {email,password}=req.body;
   postgres.select('*').from('signindata').where({email:email})
   .then(data=>{
   	if(password===data[0].password){
   		res.json("success");
   	}
   	else{
       res.json("error");
   	}
   }

   	)

})

app.post('/forgot',(req,res)=>{
	const{email}=req.body;
	postgres.select('*').from('signindata').where({email:email})
	.then(data=>{
			res.json(data[0].password)
		
	})
})



app.listen(process.env.PORT || 3000,()=>{
	console.log(' second running');
})