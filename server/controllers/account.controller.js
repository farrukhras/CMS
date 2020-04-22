'use strict'
/*
  ------------------ DEPENDENCIES --------------------
*/

// Models:
var Society = require('../models/society.model');
var CCA = require('../models/cca.model')

// Services:
var jwt = require('../services/jwt');
var httpStatus = require('../services/http-status');

// Others:
var customError = require('../errors/errors');
var helperFuncs = require('../services/helper-funcs');

/*
  ------------------ CODE BODY --------------------
*/

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

/**
 * Creates a new CCA member account if all required fields 
 * are provided. In case an account with the same email address
 * already exists, it will not be created. 
 */
exports.createCCAAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let existingCCA = await CCA.findOne({email: params.email}, 'ccaId');

    if (existingCCA) {
      // throw duplicate user error
      throw new customError.DuplicateUserError("cca user already exists");
    } else {
      let reqCCA = new CCA({firstName: params.firstName, lastName: params.lastName, email: params.email, password: params.password, picture: params.picture, permissions: params.permissions, active: true});
      await reqCCA.save();

      res.json({
        statusCode: 201, 
        statusName: httpStatus.getName(201), 
        message: "Account Successfully Created", 
        ccaId: reqCCA.ccaId
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
* Creates a new Society Account if all required fields
* are provided. In case an account with the same email 
* address already exists, it will not be created. 
*/
exports.createSocietyAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let existingSociety = await Society.findOne({email: params.email});

    if (existingSociety){
      // throw duplicate error
      throw new customError.DuplicateUserError("society user already exists");
    } else {
      let reqSociety = new Society({nameInitials: params.nameInitials, name: params.name, email: params.email, password: params.password, emailPresident: params.emailPresident, emailPatron: params.emailPatron, active: true});
      await reqSociety.save();

      res.json({
        status: 201,
        statusName: httpStatus.getName(201),
        message: "Account Creation Successful",
        societyId: reqSociety.societyId
      });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Edits details of an existing account of a 
 * CCA member, and throws an error if the user 
 * is not found.
 */
exports.editCCAAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let ccaObject = helperFuncs.duplicateObject(params, ["email", "password", "role", "firstName", "lastName", "picture", "active"], true);
    if (params.permissions) {
      let reqPermissions = helperFuncs.duplicateObject(params.permissions, [], true, "permissions.");
      ccaObject.$set = reqPermissions;
    }

    let reqCCA = await CCA.findOneAndUpdate({ccaId: params.ccaId}, ccaObject);

    if (reqCCA) {
      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Account Successfully Edited"
      });
    } else {
      // throw user not found error
      throw new customError.UserNotFoundError("cca user not found");
    }
  } catch (err) {
    next(err);
  }
}

/**
* Edits details of an existing account of a 
* Society, and throws an error if the user
* is not found.
*/
exports.editSocietyAccount = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let societyObject = helperFuncs.duplicateObject(params, ["email", "password", "name", "nameInitials", "presidentEmail", "patronEmail", "active"], true);

    let reqSociety = await Society.findOneAndUpdate({societyId: params.socId}, societyObject);
  
    if (reqSociety){
      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Account Successfully Edited"
      });
    } else {
      // throw user not found error
      throw new customError.UserNotFoundError("society user not found");
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Fetches details of all CCA member 
 * accounts, throws an error if member
 * is not found.
 */
exports.getCCAList = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try{
    let reqCCAList = await CCA.find({}, '-_id -password');
    
    if (reqCCAList.length) {
      let userList = [];

      for (let i = 0; i < reqCCAList.length; i++) {
        userList[i] = helperFuncs.duplicateObject(reqCCAList[i], ["ccaId", "email", "role", "firstName", "lastName", "picture", "active"]);
        userList[i].permissions = helperFuncs.duplicateObject(reqCCAList[i].permissions);
      }

      // success response
      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: " CCA Account List Retrieved",
        userList: userList
      });
    } else {
      // throw users not found error
      throw new customError.UserNotFoundError("no cca users exist");
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Fetches details of all Society 
 * Accounts, throws an error if a
 * society is not found.
 */
exports.getSocietyList = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try{
    let reqSocietyList = await Society.find({}, '-_id -password');
    
    if (reqSocietyList.length) {
      let userList = [];

      for (let i = 0; i < reqCCAList.length; i++) {
        userList[i] = helperFuncs.duplicateObject(reqCCAList[i], ["societyId", "email", "name", "nameInitials", "presidentEmail", "patronEmail", "active"]);
      }

      // success response
      res.json({
        statusCode: 200,
        statusName: httpStatus.getName(200),
        message: "Society Account List Retrieved",
        userList: userList
      });
    } else {
      // throw user not found error
      throw new customError.UserNotFoundError("no society users exist");
    }
  } catch (err){
    next(err);
  }
}

/**
 * Changes the password of a CCA
 * account.
 */
exports.changeCCAPassword = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
    let reqCCA = await CCA.findById(params.userObj._id, 'password');

    if(reqCCA.password == params.passwordCurrent) {
      await CCA.findByIdAndUpdate(params.userObj._id, {password: params.passwordNew}, 'ccaId');

      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Password Successfully Changed"
      });
    } else {
      // throw bad request error - invalid password
      throw new customError.AuthenticationError("invalid password");
    }

  } catch (err) {
    next(err);
  }
}

/**
 * Changes the password of a Society
 * account.
 */
exports.changeSocietyPassword = async (req, res, next) => {
  //Variables:
  let params = req.body;

  try{
    let reqSociety = await Society.findById(params.userObj._id, 'password');

    if(reqSociety.password == params.passwordCurrent) {
      await Society.findByIdAndUpdate(params.userObj._id, {password: params.passwordNew}, 'socId');

      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Password Successfully Changed"
      });
    } else {
      // throw bad request error - invalid password
      throw new customError.AuthenticationError("invalid password");
    }
  } catch (err) {
    next(err);
  }
}

/**
* Changes the picture of a CCA
* account.
*/
exports.changeCCAPicture = async (req, res, next) => {
  // Variables:
  let params = req.body;

  try {
      await CCA.findByIdAndUpdate(params.userObj._id, {picture: params.picture});

      // success response
      res.json({
        statusCode: 203,
        statusName: httpStatus.getName(203),
        message: "Picture changed successfully"
      });
  } catch (err) {
    next(err);
  }
}