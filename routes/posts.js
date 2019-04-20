var express = require('express');
var router = express.Router();
var Post = require('../models/post')

/* GET users listing. */
router.get('/', function(req, res) {
  Post.get(null,function(err,posts){
	  if(err){
		  posts = [];
	  }
	 res.setHeader('Content-Type','text/html;charset=UTF-8');
	 res.end(JSON.stringify(posts),'utf-8');
  })
});

module.exports = router;
