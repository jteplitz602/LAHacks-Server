(function(){
  "use strict";

  var base = require("./base.js"),

      ChromeWorkspaceCtrl, _ptype;

  ChromeWorkspaceCtrl = function(schemas, user, workspaceId){
    this.schemas     = schemas;
    this.user        = user;
    this.workspaceId = workspaceId;
  };

  _ptype = ChromeWorkspaceCtrl.prototype = base.getProto("api");
  _ptype._name = "ChromeWorkspace";

  _ptype.addChromeData = function(data, cb){
    this.schemas.Workspace.findOne({owner: this.user._id, _id: this.workspaceId}, "tabs accounts",
                                   function(err, workspace){
      if (err){ return cb(err) }

      if (!workspace){
        return cb({
          statusCode: 404,
          _err: "No such workspace"
        });
      }

      workspace.tabs     = data.tabs;
      workspace.accounts = data.accounts;
      workspace.save(cb);
    });
  };

  _ptype.prePrep = function(data, cb){
    this.schemas.Workspace.findOne({owner: this.user._id, _id: this.workspaceId}, "tabs accounts",
                                   function(err, workspace){
      if (err){ return cb(err) }

      if (!workspace){
        return cb({
          statusCode: 404,
          _err: "No such workspace"
        });
      }
      var workspaceObj = workspace.toObject();
      workspaceObj.tabs = workspace.tabs.sort({order: 1});
      data.workspace = workspaceObj;
      data._err      = 0;

      return cb();
    });
  };

  module.exports = ChromeWorkspaceCtrl;
}());