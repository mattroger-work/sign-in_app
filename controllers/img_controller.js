const fs = require('fs');
const sharp = require('sharp');
const jimp = require("jimp");
const helper = require('../helpers/helper');

exports.edit_tag = async function(photo){

    user_photo_path = "./visitor_tag/user_photo.png";
    await helper.base64_decode(photo, user_photo_path);
    
    image = await jimp.read(user_photo_path)
    await image.brightness(.6)
      .write(user_photo_path)

    await sharp(user_photo_path)
      .resize({width:144, height:140})
      .greyscale()
      .toFile("./visitor_tag/user_photo_final.png")
      .then(async function (){
        
      })
    

      //convert user image final into b64
      var user_img_final = await helper.base64_encode(__dirname + '\\..\\visitor_tag\\user_photo_final.png');
      user_img_final = "data:image/png;base64," + user_img_final;

      return user_img_final;
}

exports.edit_mail_photo = async function(photo){
    //convert to buffer
    data = Buffer.from(photo, 'base64');
    edited_data = await sharp(data)
        .resize({width:144, height:140})
        .greyscale()
        .toBuffer((err, data, info) =>{
            //lol
            return data
        });
    return edited_data

}