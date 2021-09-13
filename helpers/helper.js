const fs = require('fs');

exports.get_date = function(time){
    time = time || false;
    day = new Date().getDate();
    day = day < 10 ? '0' + day : day;
    month = new Date().getMonth()+1;
    month = month < 10 ? '0' + month : month;
    year = new Date().getFullYear();
    hour = new Date().getHours()+4;
    //don't even ask because idk, for some reason ms only gets the right date if it's 4 hours ahead
    min = new Date().getMinutes();

    if(!time){
        now = month + '/' + day + '/' + year
    }else{
        now =  month + '/' + day + '/' + year + ' ' + hour + ':' + min;
    }
    return now;
}

exports.base64_encode = function (file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}

exports.base64_decode = async function(b64, file) {
    b64_image = b64.split(';base64,').pop();
    fs.writeFileSync(file,b64_image, {encoding: 'base64'}, function(err){
        console.log('Done')
    })
  
  }

exports.get_date_comp = function(){
    date = new Date;
    date = date.getMonth() + date.getDate() + date.getFullYear() + date.getHours() + date.getMinutes() + date.getSeconds()

    return date
}
  