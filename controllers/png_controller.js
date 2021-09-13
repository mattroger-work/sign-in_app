const fs = require('fs');
const helper = require('../helpers/helper');
const node_html_to_image = require('node-html-to-image');
const pdf = require('html-pdf');
const sharp = require('sharp');
const ps_con = require("./powershell_controller")
const jimp = require('jimp');


exports.convert_to_png = function(date, callback){
    sharp.cache({files:0});
    sharp.cache(false);
    var png_file = __dirname + '\\..\\visitor_tag\\tag.png';
    var png_final = __dirname + '\\..\\visitor_tag\\tag_final_'+date+'_.png';
    html = fs.readFileSync('./visitor_tag/tag.html', 'utf8');
    
    console.log("convert to pdf")
    //convert to png
    node_html_to_image({
        output: png_file,
        html: html
    })
    .then(() => {console.log('The image was created successfully!');

    console.log("crop image")
    //crop image
    sharp(png_file).extract({width:190, height:335, left: 0, top:0}).toFile(png_final)
    .then(function(new_file_info) {
        console.log("Image cropped and saved");
        callback();
    })
    .catch(function(err) {
        console.log(err);
    }); 
    
    }
    
    )
}
    
     
exports.convert_email = async function(first_name, last_name, photo, escort_req, class_visit, poi){
    //capitilize first letter
    first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);
    last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1);
    poi_split = poi.split('.')
    poi_first = poi_split[0]
    poi_split = poi_split[1].split('@')
    poi_last = poi_split[0]
    poi_first = poi_first.charAt(0).toUpperCase() + poi_first.slice(1);
    poi_last = poi_last.charAt(0).toUpperCase() + poi_last.slice(1);
    poi = poi_first + ' ' + poi_last

    escort_req = escort_req ? "Yes" : "No";
    class_visit = class_visit ? "Yes" : "No";
    html = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8" /> <title>TekSynap Visitor Badge - Guy</title> <style> .badge-container { position: relative; width: 192px; height: 336px; padding: 0; overflow: hidden; } .badge-background { position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 1; } .badge-background img { width: 192px; height: 336px; } .badge-content { position: absolute; top: 180px; left: 5px; z-index: 2; } .badge-content { width: 100%; padding-top: 10px; font-family: Arial, Helvetica, sans-serif; color: #000; font-size: 15px; font-weight: bold; } .badge-name { font-size: 16px; } .badge-date { font-size: 13px; margin-bottom: 5px; } .badge-photo { transform: rotate(-90deg); }   /*hex classes*/ .hex { transform: rotate(90deg); z-index: 2; left: 0px; top: 23px; display: flex; position: relative; width: 144px; height: 140px; -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); } .badge-poi{top:9px}</style> </head> <body> <div class="badge-container"> <div class="badge-background"> <img src="https://www.teksynap.com/wp-content/uploads/2021/06/TekSynap-Guest-Badge_FINAL_05_Business-Card-1.png"> </div><!-- .badge-background --> <div class="badge-content"> <div class="badge-name">'+first_name+' '+last_name+'</div> <div class="badge-date">'+helper.get_date()+'</div> <div class="badge-cleared">Cleared: '+class_visit+'</div> <div class="badge-escort">Escort: '+escort_req+'</div> <div class="badge-poi">POI: '+poi+'</div> </div><!-- .badge-content --> <div class="badge-photo"> <img src=> </div><!-- .badge-content --> <!--Div holding hex image--> <div class="hex"><img class="badge-photo" src="'+photo+'" alt="some"></div> </div><!-- .badge-container --> </body> </html>'
    
    //convert to png
    png_bufffer = await node_html_to_image({
        html : html
    })

    //crop image
    png_buffer = await sharp(png_bufffer)
        .extract({width:190, height:335, left: 0, top:0})
        .toBuffer((err, data, info) =>{
            return data
        })

    png_base64 = await png_bufffer.toString('base64');

    png_base64 = await "data:image/png;base64," + png_base64;

    return png_base64
    
}

//creates an html page that has the photo and visitor name that you can print
exports.create_png = async function(first_name, last_name, photo, escort_req, class_visit, poi){
    //capitilize first letter
    first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);
    last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1);
    poi_split = poi.split('.')
    poi_first = poi_split[0]
    poi_split = poi_split[1].split('@')
    poi_last = poi_split[0]
    poi_first = poi_first.charAt(0).toUpperCase() + poi_first.slice(1);
    poi_last = poi_last.charAt(0).toUpperCase() + poi_last.slice(1);
    poi = poi_first + ' ' + poi_last

    escort_req = escort_req ? "Yes" : "No";
    class_visit = class_visit ? "Yes" : "No";


    html = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8" /> <title>TekSynap Visitor Badge - Guy</title> <style> .badge-container { position: relative; width: 192px; height: 336px; padding: 0; overflow: hidden; } .badge-background { position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 1; } .badge-background img { width: 192px; height: 336px; } .badge-content { position: absolute; top: 180px; left: 5px; z-index: 2; } .badge-content { width: 100%; padding-top: 10px; font-family: Arial, Helvetica, sans-serif; color: #000; font-size: 15px; font-weight: bold; } .badge-name { font-size: 16px; } .badge-date { font-size: 13px; margin-bottom: 5px; } .badge-photo { transform: rotate(-90deg); }   /*hex classes*/ .hex { transform: rotate(90deg); z-index: 2; left: 0px; top: 23px; display: flex; position: relative; width: 144px; height: 140px; -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); } .badge-poi{top:9px}</style> </head> <body> <div class="badge-container"> <div class="badge-background"> <img src="https://www.teksynap.com/wp-content/uploads/2021/06/TekSynap-Guest-Badge_FINAL_05_Business-Card-1.png"> </div><!-- .badge-background --> <div class="badge-content"> <div class="badge-name">'+first_name+' '+last_name+'</div> <div class="badge-date">'+helper.get_date()+'</div> <div class="badge-cleared">Cleared: '+class_visit+'</div> <div class="badge-escort">Escort: '+escort_req+'</div> <div class="badge-poi">POI: '+poi+'</div> </div><!-- .badge-content --> <div class="badge-photo"> <img src=> </div><!-- .badge-content --> <!--Div holding hex image--> <div class="hex"><img class="badge-photo" src="'+photo+'" alt="some"></div> </div><!-- .badge-container --> </body> </html>';

    
    
}

