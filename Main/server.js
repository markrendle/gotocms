var http = require('http');
var azure = require('azure');

var config = require('./config.js');

console.log('Attach to blob service...');
var blobService = config.createBlobService();
console.log('Attach to table service...');
var tableService = config.createTableService();

var port = process.env.port || 3000;

var statics = ['css', 'js', 'images', 'favicon.ico'];

var logError = function(error) {
    for (var p in error) {
        console.log(p + ': ' + error[p]);
    }
}
var writeBlock = function(res, gridClass, text) {
    res.write('<div class="' + gridClass + '">');
    res.write(text);
    res.write('</div>');
};

var listener = function(req, res) {
    var url = req.url === '/' ? 'index' : req.url.substring(1);
    console.log(url);

    var urlParts = url.split('/');
    // If URL is a static resource, just redirect
    if (statics.indexOf(urlParts[0]) > -1)
    {
        res.writeHead(301, {'Location': config.staticUrl + url});
        res.end();
        return;
    }

    // Callback-looping function
    var renderLoop = function(rows, index, finalCallback) {
        console.log('renderLoop(' + index + ')');
        var row = null;
        var renderBlob = false;
        for (; index < rows.length; index++) {
	        row = rows[index];
	        if (index === 0) {
	            res.write('<div class="row">');
	        } else if (row.PartitionKey != rows[index - 1].PartitionKey) {
	            res.write('</div><div class="row">');
	        }
	        
	        var gridClass = row.gridClass;
	        if (index + 1 === rows.length || row.PartitionKey != rows[index + 1].PartitionKey) {
	            gridClass = gridClass + " last";
	        }

	        if (typeof row.html === 'undefined' || row.html === null || row.html === '') {
	        	renderBlob = true;
	        	break;
	        }

	        writeBlock(res, gridClass, row.html);
	    }

	    if (renderBlob) {
	        blobService.getBlobToText('content', row.blobUrl, function(error, text) {
	            if (!error) {
			        writeBlock(res, gridClass, text);
	            }
	            renderLoop(rows, index + 1, finalCallback);
	        });
	        return;
	    }

        if (index >= rows.length) {
            finalCallback();
        }
    };

    var finish = function() {
        console.log("finish");
        blobService.getBlobToText('content', 'bottom.html', function(error, text) {
            console.log(text);
            res.write(text);
            res.end();
        });
    };

    var gotContent = function(error, rows) {
        console.log('gotContent...\r\n')
        if (error) {
            logError(error);
//            console.log('Error: ' + error + '\r\n');
            res.writeHead(500);
            res.end();
            return;
        }
        renderLoop(rows, 0, finish);
    };

    var getContent = function() {
        console.log('getContent...\r\n')
        var query = azure.TableQuery.select().from(url);
        tableService.queryEntities(query, gotContent);
    };

    blobService.getBlobToText('content', 'top.html', function(error, text) {
        if (!error) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(text);
            getContent();
        } else {
            console.log('getBlobToText error:\r\n')
            for (var p in error)
            {
                console.log(p + ':' + error[p] + '\r\n');
            }
        }
    });
};

http.createServer(listener).listen(port);

console.log("Listening on port " + port);