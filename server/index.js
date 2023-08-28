const express = require('express');
const app = express();
var cors = require('cors');
const fs = require('fs');
const fileName = './file.json';
const file = require(fileName);

const PORT = 3000;

app.use(express.json());
app.use(cors())

app.post('/', function (req, res) {
    let { newUserData, deleteFlag} = req.body;
    let cloneTableData = [...file];
    let index = cloneTableData.findIndex((data) => data["Reg No:"] === newUserData["Reg No:"]);
    console.log("before delet Length",cloneTableData.length )
    if (index != -1)
        if (!deleteFlag) cloneTableData[index] = newUserData;
        else cloneTableData = cloneTableData.filter((val, indexNo) => indexNo !== index);
    else {
        cloneTableData.push(newUserData)
    }
    console.log("After delete Length",cloneTableData.length )
    fs.writeFile(fileName, JSON.stringify(cloneTableData), function writeJSON(err) {
        if (err) return console.log(err);
        // console.log(JSON.stringify(file));
        console.log('writing to ' + fileName);
      });
	console.log(req.body);
	res.end();
})

app.get('/list', (req, res) => {
    fs.readFile(fileName, 'utf8', function(err, data){
        if (err) return console.log(err);
        res.send(data);
        console.log(data);
    });
  })

app.post('/backup', (req, res) => {
    const { updatefileName } =  req.body;
    fs.appendFile(`${updatefileName}.json`, JSON.stringify(file), function writeJSON(err) {
        if (err) return console.log(err);
        console.log('writing to ' + fileName);
        res.send("updated Successfully");
      });
})

app.listen(PORT, function (err) {
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});
    
