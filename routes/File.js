(function(){
  "use strict";

  var _ = require("underscore"),
      handleGet,
      handler, dispatch,

      ControllerClass = require("../controllers/File.js");

  handleGet = function(req, res, next){
    var control = new ControllerClass(req._schemas, req._conf, req.user);
    
    control.serveFile(req, res, req.params.id, req.query.account);
  };

  dispatch = {GET: handleGet};
  handler = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }

    return next(405);
  };
  
  module.exports = handler;
}());
