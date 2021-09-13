const ps_con = require('../controllers/powershell_controller');
const share_con = require('../controllers/sharepoint_controller');
const fs = require('fs');
const pdf_con = require('../controllers/pdf_controller');
const printer_con = require('../controllers/printer_controller');
const helper = require('../helpers/helper');
const sharp = require('sharp');
const jimp = require("jimp")


//renders the index and writes the users to the users.json file
exports.render_get = async function(req, res, next) {
    ps_con.get_users();
    let params = {title: 'Sign-in', active: { sign: true }};
    res.render('index', params);
  }

  //this is the complete function that activates when the user presses submit on the sign-in button
  //the if statements are orders so that if a function returns false it won't continue
exports.complete = async function(req, res, next){
    first_name = req.body.first_name;
    last_name = req.body.last_name;
    poi = req.body.poi;
    us_cit = req.body.us_cit;
    class_visit = req.body.class_visit;
    escort_req = req.body.escort_req;
    rep_comp = req.body.rep_comp;
    meet_pur = req.body.meet_pur;
    photo = req.body.photo;

    //get the users location from the location file
    rawdata = fs.readFileSync('json_files/location.json');
    location = JSON.parse(rawdata);
    location = location.location;

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
    
    succ = true;
    res_var = "true";
    if(succ){
      share_con.log_visitor(first_name, last_name, poi, us_cit, class_visit, escort_req, rep_comp, meet_pur, location);
      console.log('log visitor');
    }else{
      res_var = "Error with Logging Visitor"
    }
    if(succ){
      await pdf_con.create_pdf(first_name, last_name, user_img_final, escort_req, class_visit, poi);
      console.log('Create PNG');
      img = await pdf_con.convert_email(first_name, last_name, poi);
      ps_con.send_mail(first_name, last_name, poi, img);
    }else{
      res_var = "Error with Sending Mail"
    }
    if(succ){
      printer_con.print();
      console.log('Print');
    }else{
      res_var = "Error with PDF Creation"
    }
    res.send(res_var);


}

//this will render the sign_out page
//this wile unlink the visitors.json in case of an error
exports.render_sign_out = async function(req, res, next){
  let params = {title: 'Sign-out', active: { sign: false }};
  //delete the file if it exists then create the file to delete it later
  if(fs.existsSync('json_files/visitors.json')){
    fs.unlinkSync('json_files/visitors.json');
  }
  share_con.get_visitors();
  res.render('sign_out', params);
}

//this will render the sign_in page
exports.render_sign_in = async function(req, res, next){
  let params = {title: 'Sign-in', active: { sign: false }};
  res.render('sign_in',params)
}

//this will send the visitors on the sharepoint site to the client
//this will most likely throw errors on the client side because the client will keep quering until it the file is created
exports.read_visitors = async function(req, res, next){
  file_path = 'json_files/visitors.json'

  if(fs.existsSync(file_path)){
    visitors = fs.readFileSync(file_path);
    res.send(visitors);
    fs.unlinkSync(file_path);
  }else{
    res.send('err')
    console.log('err')
  }

}//this is for the client, it sends all the users for the dropdown on the client
exports.read_poi = async function(req, res, next){
  users = fs.readFileSync('json_files/users.json');
  res.send(users);
}

//this activates when the sign out button is clicked, it will update the visitors with a time out field on the sharepoint list
exports.sign_out = async function(req, res, next){
  id = req.body.id;
  share_con.update_visitors(id);
  res.send('done')
}

