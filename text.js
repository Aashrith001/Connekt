var MongoClient = require('mongodb');
var url = 'mongodb://localhost:27017/';
var Academic = require('./models/academic');


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("connekt");
	/*dbo.collection("academics").findOne({branch:"IT"},function(err,aca){
		if(err) console.log(err);
		else{
			console.log(aca);
			// aca.subjects.push(newSub);
			// aca.save();	
		}
	});*/
  dbo.collection("subjects").find({branch:"IT"},function(err,obj){
	  if(err) console.log("err occured");
	  else {
		obj.forEach(function(ob){
			dbo.collection("academics").findOne({branch:"IT"},function(err,aca){
				if(err) console.log(err);
				else{
					aca.subjects.push({id : ob._id,sem : ob.sem});
					dbo.collection("academics").save();
					//console.log(aca);
				}
			});
	  	})  
	  }
  })
});

/*MongoClient.connect(url, function (err, db) {
	if (err) throw err;
	var dbo = db.db('connekt');
	var myobj = [
		{ name: 'OOPS', sem: 'III',branch: 'IT'},
		{ name: 'AIML', sem: 'VI' ,branch: 'IT'},
		{ name: 'DBMS', sem: 'IV' ,branch: 'IT'},
		{ name: 'DAA', sem: 'IV',branch: 'IT' },
		{ name: 'BE', sem: 'III' ,branch: 'IT'},
		{ name: 'DCCN', sem: 'V',branch: 'IT' },
		{ name: 'OS', sem: 'V' ,branch: 'IT'},
		{ name: 'PPS', sem: 'I' ,branch: 'IT'},
		{ name: 'DM', sem: 'III',branch: 'IT' },
		{ name: 'DELD', sem: 'III',branch: 'IT'},
		{ name: 'DS', sem: 'II' ,branch: 'IT'}
	];
	dbo.collection('subjects').insertMany(myobj, function (err, res) {
		if (err) throw err;
		console.log('Number of documents inserted: ' + res.insertedCount);
		db.close();
	});
});
*/
/*
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("connekt");
  var id = '60a2adeb9924bd1060cfc4d0';
  var branch;
  Academic.findById(id,function(err,academic){
	if(err) console.log(err)
	else{
		branch ={id:academic._id,branch:branch}
	}
  })
	console.log(branch);
  var myobj =[ 
	  	{
			name:'DBMS',
			branch:branch,
			forum:{
				que:'what is c programming?',
				response:[
					'c is a programming language',
					'c is low level programming language',
					'c is c',
					'i don"t know about c'
				]
			}
		}
	];
  dbo.collection("subjects").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
});

*/