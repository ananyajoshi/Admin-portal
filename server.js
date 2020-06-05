const express = require("express");
const bodyParser = require("body-parser");
var mysql = require("mysql");
var app = express();
const fs = require('fs');
const AWS = require('aws-sdk');
app.use(bodyParser.json());



var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'USERS',
    multipleStatements: true
});
mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded');
    else
        console.log('DB connection failed' + JSON.stringify(err, undefined, 2));

});

const s3 = new AWS.S3({
    accessKeyId:'AKIAIA5HRM44AXOUKRFA',
    secretAccessKey:'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'
    });


//username and password
app.post("/web/chk",(req,res)=>{
    console.log(req.body);
    let usrNm  = req.body.usrNm;  
    let pwd = req.body.pwd;

    let sql1 = `select count(*) as count FROM admin_table WHERE USER_NAME = ?`;
    let sql=`select PASSWORD FROM admin_table WHERE USER_NAME = ?`;
    let values = [usrNm];

    mysqlConnection.query(sql1,values,(err,result)=>{
       
    
        if(result[0].count==1){
            console.log('user exists');

            mysqlConnection.query(sql,values,(err,result)=>{
        
                  if(result[0].PASSWORD==pwd){
                      res.status(200).send({verification : 'Verified'})
                  }else{
                      res.status(200).send({verification : 'Not Verified'})
                  }
            });     
        }
       else{
        res.status(200).send({verification : 'User not valid'})
       }
   });       
}); 


function encode(data){
    let buf = Buffer.from(data);
    let base64 = buf.toString('base64');
    return base64;
}


const  uploadFile = (fileName)=>{
    const fileContent = fs.readFileSync(fileName);

    const params = {
        Bucket : 'aztecs',
        Key:fileName,
        Body:fileContent
    };

    s3.upload(params,(err,data)=>{
        if (err) throw err 
        console.log(data);
    });
};

//getting image-name from database and using it to fetch image from  S3 ---------------------

function getImage(imgname){
    const data =  s3.getObject(
        {
            Bucket: 'aztecs',
            Key: imgname,
        }  
    ).promise();
    return data;
}

   
app.get('/hello',(req,res)=>{
    let imgname = req.query.imgname;
   
    getImage(imgname)
    .then((img)=>{
    let x=encode(img.Body);
    let image=`data:image/jpeg;base64,${x}`;
    
    res.send(image);
    console.log("image shown successfully");
    }).catch((e)=>{
    res.send(e);
    });
    
});

//----------------------------------------------------------------------------------------------------------

/*
app.get("/web/no_all_rqst",(req,res)=>{
    
    let sql = `select count(*) from requests_table  `;
    
    con.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log("No. of All is" + result[0].count );
        res.status(200).send({no_all_rqst : result[0].count });
        
    });
});


app.get("/web/no_pend_rqst",(req,res)=>{
    
    let sql = `select count(*) from requests_table where VERIFY_STATUS = 0 `;
    
    con.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log("no. of pending Requests is" + result[0].count );
        res.status(200).send({no_pend_rqst : result[0].count });
        
    });
});

app.get("/web/aprv_rqst",(req,res)=>{
    let id = req.body.id;
    
    let sql = `select * from requests_table where VERIFY_STATUS = 1 `;
    let values = [id]
    
    mysqlConnection.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log(JSON.stringify(result));
        //res.status(200).JSON(result);
        
    });
});

app.get("/web/rjt_rqst",(req,res)=>{
    let id = req.body.id;
    
    let sql = `select * from requests_table where VERIFY_STATUS = 2 `;
    let values = [id]
    
    con.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log(JSON.stringify(result));
        res.status(200).JSON(result);
        
    });
});
*/
//Get all requests
app.get("/web/all_rqst",(req,res)=>{
    let id = req.body.id;
    
    let sql = `select * from requests_table `;
    let values = [id]
    
    mysqlConnection.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log(JSON.stringify(result));
        res.send(JSON.stringify(result));
       // res.status(200).JSON(result);
        
    });
});


//Get selected user requests
app.get("/web/selected_rqst",(req,res)=>{
    let id = req.query.id;
    let sql = `select * from requests_table where id=? `;
    let values = [id]
    
    mysqlConnection.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log(JSON.stringify(result));
        res.send(JSON.stringify(result));
       // res.status(200).JSON(result);
        
    });
});

app.get("/web/pnd_rqst",(req,res)=>{
    let id = req.body.id;
    
    let sql = `select * from requests_table where VERIFY_STATUS = 0 `;
    let values = [id]
    
    mysqlConnection.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log(JSON.stringify(result));
        res.send(JSON.stringify(result));
        //res.status(200).JSON(result);
        
    });
});
app.get("/web/app_rqst",(req,res)=>{
    let id = req.body.id;
    
    let sql = `select * from requests_table where VERIFY_STATUS = 1 `;
    let values = [id]
    
    mysqlConnection.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log(JSON.stringify(result));
        res.send(JSON.stringify(result));
        //res.status(200).JSON(result);
        
    });
});
app.get("/web/rej_rqst",(req,res)=>{
    let id = req.body.id;
    
    let sql = `select * from requests_table where VERIFY_STATUS = 2 `;
    let values = [id]
    
    mysqlConnection.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log(JSON.stringify(result));
        res.send(JSON.stringify(result));
        //res.status(200).JSON(result);
        
    });
});

app.post("/web/update_request",(req,res)=>{

    let id = req.body.id;
    let sts = req.body.sts;
   
    
    let sql = `update requests_table set VERIFY_STATUS = ? where id = ? `;
    let values = [sts,id]
    
    mysqlConnection.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log("Updated status of  Request @" + id );
        res.status(200).send("ok");
        
    });
});
/*
app.get("/web/get_request",(req,res)=>{

    let id = req.body.id;
    
    let sql = `select * from requests_table where id = ? `;
    let values = [id]
    
    con.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log(JSON.stringify(result[0]));
        res.status(200).JSON(result[0]);
        
    });
});




app.get("/web/bills_in_mnth",(req,res)=>{

    let dt = new Date();
    
    let sql = `select count(*) from  requests_table where month(REQUEST_VERIFY_DATETIME) = month(?)  and year(REQUEST_VERIFY_DATETIME) = year(?)`;
    let values = [dt,dt]
    
    con.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log("No. of  Request in Current Month is " + result[0].count);
        res.status(200).send({no_of_bills : result[0].count});
    });
});


app.post("/web/amount_in_mnth",(req,res)=>{

    let dt = new Date();
    
    let sql = `select sum(REQUESTED_AMOUNT) from  requests_table where month(REQUEST_VERIFY_DATETIME) = month(?)  and year(REQUEST_VERIFY_DATETIME) = year(?)`;
    let values = [dt,dt]
    
    con.query(sql,values,(err,result)=>{
        if(err) throw err;
        console.log("Amount reimbursed in Current Month is " + result[0].sum(REQUESTED_AMOUNT));
        res.status(200).send({no_of_bills : result[0].sum(REQUESTED_AMOUNT)});
    });
});


app.post("/web/crt_rqst",(req,res)=>{

    let name =req.body.name;
    let ph_no =req.body.phone;
    let amnt =req.body.bill_amount;
    let bill_date = req.body.bill_date;
    let bill_company = req.body.bill_company;
    let img =  req.body.bill_image;


    let dt = new Date();
    
    let sql = `insert into requests_table (APPLICANT_NAME,APPLICANT_MOBILE_NUMBER, BILL_DATE,
        BILL_COMPANY_NAME,REQUESTED_AMOUNT,IMAGE_in_base64,CREATED_DATETIME ) 
        VALUES(?,?,?,?,?,?,?)`;
    let values = [name,ph_no,bill_date,bill_company,amnt,img,dt]
    
    con.query(sql,values,(err,result)=>{
        if(err) throw err;
        res.status(200).send({'id':result.insertId});
    });
});


*/


app.listen(3000, () => console.log('Server running at port no:3000'));