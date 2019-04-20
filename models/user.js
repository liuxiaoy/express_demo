
var mongodb = require('./db'); 

function User(user) { 
  this.name = user.name; 
  this.password = user.password; 
}; 
module.exports = User; 

//将用户对象的数据保存到数据库中
User.prototype.save = function save(callback) { 
  // 存入 Mongodb 的文档 
  var user = { 
    name: this.name, 
    password: this.password, 
  };
  mongodb.open(function(err, db) { 
    if (err) { 
      return callback(err); 
    } 
    // 读取 users 集合 
    db.collection('users', function(err, collection) { 
      if (err) {
        mongodb.close(); 
        return callback(err); 
      } 
      // 为 name 属性添加索引 
      collection.ensureIndex('name', {unique: true},function(err){
		  if(err){
		  console.log("Express 13");
		  return callback(err);}
          // 写入 user 文档 
		  collection.insert(user, {safe: true}, function(err, user) { 
			  mongodb.close(); 
			  callback(err, user); });
	  });  
    });
  });
}; 

//对象构造函数的方法
User.get = function get(username, callback) { 
  mongodb.open(function(err, db) { 
    if (err) { 
		console.log("Express 22");
      return callback(err); 
    } 
    // 读取 users 集合 
    db.collection('users', function(err, collection) { 
      if (err) { 
		  console.log("Express 24");
        mongodb.close(); 
        return callback(err); 
      } 
      // 查找 name 属性为 username 的文档 
      collection.findOne({name: username}, function(err, doc) { 
        mongodb.close(); 
        if (doc) { 
          // 封装文档为 User 对象 
          var user = new User(doc); 
          callback(err, user); 
        } else { console.log("Express 28");
          callback(err, null); 
        } 
      }); 
    }); 
  }); 
}; 
