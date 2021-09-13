var express = require('express');
var router = express.Router();
var index_con = require('../controllers/index_controller');

//home page
router.get('/', index_con.render_get);
//send data to sharepoint, send email, and create tag
router.post('/send', index_con.complete);
//get the sign-out page
router.get('/sign-out', index_con.render_sign_out);
//get the sign-in page
router.get('/sign-in', index_con.render_sign_in);
//get the users.json file
router.get('/poi', index_con.read_poi);
//update visitors timeout field
router.post('/visitors', index_con.sign_out)
//get the visitors page from sharepoint
router.get('/visitors', index_con.read_visitors);

module.exports = router;
