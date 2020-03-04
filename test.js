fs = require('fs');

function read (err , data){
    console.log('data:' , data);
}
fs.readdir('c:/' , read);
console.log('come after');

