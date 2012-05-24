var azure = require('azure');

exports.createBlobService = function() {
    //if (typeof process.env.port === 'undefined') {
        return azure.createBlobService("gotoams","WfknA/uCz78fLYJI4bav7e1emo3ilg4QtGoz4qKSCkFVxSEmAWNYusvTua3ZRmzFsDvdueasHMe7NCcb1T/3Kg==");
    //}
    //return azure.createBlobService("gotoams","WfknA/uCz78fLYJI4bav7e1emo3ilg4QtGoz4qKSCkFVxSEmAWNYusvTua3ZRmzFsDvdueasHMe7NCcb1T/3Kg==");
};

exports.createTableService = function() {
    //if (typeof process.env.port === 'undefined') {
        return azure.createTableService("gotoams","WfknA/uCz78fLYJI4bav7e1emo3ilg4QtGoz4qKSCkFVxSEmAWNYusvTua3ZRmzFsDvdueasHMe7NCcb1T/3Kg==");
    //}
    //return azure.createTableService("gotoams","WfknA/uCz78fLYJI4bav7e1emo3ilg4QtGoz4qKSCkFVxSEmAWNYusvTua3ZRmzFsDvdueasHMe7NCcb1T/3Kg==");
};

exports.staticUrl = 'http://gotoams.blob.core.windows.net/static/';
