
/*
 * GET home page.
 */
var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());

var azure = require('azure');
var blobService = azure.createBlobService("markrendle","gc/CXU+PaiqOZgDUOVzIERZre44CqzWWiSpMrxH6lA/amXj0qsFTChMB/tpgtFtObn/HcYuB2iBgHwNOX5K5oQ==");



exports.index = function(req, res){
	var downloadBlobs = function(indexBlobs, index, hash, finalCallback) {
		if (index >= indexBlobs.length)	{
			finalCallback(hash);
		}
		else {
			var pathParts = indexBlobs[index].name.split('/');
			if (hash[pathParts[1]] === undefined) hash[pathParts[1]] = {};
			blobService.getBlobToText('content', indexBlobs[index].name, function(error, response) {
				hash[pathParts[1]][pathParts[2]] = response;
				downloadBlobs(indexBlobs, index + 1, hash, finalCallback);
			})
		}
	};

	var render = function(rows) {
	  	res.render('index', { title: 'mark.rendle', 'rows': rows });
	}

	var blobsListed = function(error, blobList) {
		var indexBlobs = blobList.filter(function(blob) {
			return _(blob.name).startsWith('index/');
		});
		downloadBlobs(indexBlobs, 0, {}, render);
	};
	blobService.listBlobs('content', null, blobsListed);
};