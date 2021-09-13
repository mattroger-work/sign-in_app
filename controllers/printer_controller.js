const printer = require('node-native-printer');
const fs = require('fs');
const pdf_con = require('../controllers/pdf_controller');
const helper = require("../helpers/helper");
const { printerOptions } = require('node-native-printer');


exports.print = async function(){
    date = helper.get_date_comp();
    console.log("printer")
    //we gotta go deeper leo
    pdf_con.convert_to_pdf(date, () =>{
        printer.setPrinter("Brother QL-820NWB");
        printer.print('visitor_tag/tag_final_'+date+'_.png',{
            "landscape": false,
            "paperSize": '2.3" x 3.4"'
        })
    });

}


