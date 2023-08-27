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
    let newUserData = req.body
    let index = file.findIndex((data) => data["Reg No:"] === newUserData["Reg No:"]);
    if (index != -1)
        file[index] = newUserData;
    else
        file.push(newUserData)
    fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
        if (err) return console.log(err);
        // console.log(JSON.stringify(file));
        console.log('writing to ' + fileName);
      });
	console.log(req.body);
	res.end();
})

app.get('/list', (req, res) => {
    res.send(JSON.stringify(file));
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
    
