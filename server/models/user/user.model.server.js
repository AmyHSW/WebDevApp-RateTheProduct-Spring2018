var mongoose = require("mongoose");
var UserSchema = require("./user.schema.server");
var ProductSchema = require("../product/product.schema.server");
var UserModel = mongoose.model("UserModel", UserSchema);
var ProductModel = mongoose.model("ProductModel", ProductSchema);

UserModel.createUser = createUser;
UserModel.findUserById = findUserById;
UserModel.findUserByUserName = findUserByUserName;
UserModel.findUserByCredentials = findUserByCredentials;
UserModel.updateUser = updateUser;
UserModel.deleteUser = deleteUser;
UserModel.findUsersByType = findUsersByType;
UserModel.findFavoritesForUser =  findFavoritesForUser;
UserModel.addFollow =  addFollow;
UserModel.deleteFollow =  deleteFollow;
UserModel.addFavorite =  addFavorite;
UserModel.deleteFavorite =  deleteFavorite;

//helper functions -- delete after testing
function findAllUsers(){
  UserModel.find(function (err, doc) {
    console.log(docs);
  })
}

module.exports = UserModel;

function createUser(user){
  //user.followers = new Array(100);
  //user.followings = new Array(100);
  //user.favorites = new Array(100);
  return UserModel.create(user);
}

function findUserById(userId){
  return UserModel.findById(userId);
}

function findUserByUserName(username){
  return UserModel.findOne({username: username});
}

function findUserByCredentials(username, password){
  return UserModel.findOne({username: username, password: password});
}

function updateUser(userId, user){
  return UserModel.update({_id: userId}, user );
}

function deleteUser(userId) {
  return UserModel.remove({_id: userId});
}

function findUsersByType(type) {
  return UserModel.find({type:type});
}

function findFavoritesForUser(userId) {
  return UserModel.findById(userId).favorites;
}

function addFollow(followerId, followeeId) {
  return UserModel.findOne({_id:followeeId}, function (err,followee) {
    UserModel.findOne({_id:followerId}, function (err,follower) {
      followee.followers.push(follower);
      follower.followings.push(followee);
      followee.save();
      follower.save();
    });
  });
}

function deleteFollow(followerId, followeeId) {
  return UserModel.findOne({_id: followeeId}, function (err, followee) {
    UserModel.findOne({_id: followerId}, function (err, follower) {
      for (var i = 0; i < followee.followers.length; i++) {
        if (followee.followers[i].equals(followerId)) {
          followee.followers.splice(i, 1);
          return followee.save();
        }
      }
      for (var i = 0; i < follower.followings.length; i++) {
        if (follower.followings[i].equals(followeeId)) {
          follower.followings.splice(i, 1);
          return follower.save();
        }
      }
    });
  });
}

function addFavorite(userId, productId) {
  return UserModel.findOne({_id:userId}, function (err, user) {
    user.favorites.push(ProductModel.findById(productId));
  })
}

function deleteFavorite(userId, productId) {
  return UserModel.findOne({_id:userId}, function (err, user) {
    var favorites = user.favorites;
    for (var i = 1; i < favorites.length; i++) {
      if (favorites[i]._id === productId) {
        favorites.splice(i, 1);
      }
    }
  })
}



