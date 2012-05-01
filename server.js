//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081)
	, FlickrAPI = require('./node_modules/flickrnode/lib/flickr').FlickrAPI
	, sys = require('util')
	, fs = require('fs');

var ClioZoom = function (socket, port, connect, express) {
	//Setup Express
	this.server = express.createServer();
	var self = this;
	this.server.configure(function(){
	    self.server.set('views', __dirname + '/views');
	    self.server.set('view options', { layout: false });
	    self.server.use(connect.bodyParser());
	    self.server.use(express.cookieParser());
	    self.server.use(express.session({ secret: "shhhhhhhhh!"}));
	    self.server.use(connect.static(__dirname + '/static'));
	    self.server.use(self.server.router);
	});

		
	this.server.listen( port);
	this.server.get('/*', function(req,res){
	  res.render('index.jade', {
	    locals : { 
	              title : 'Clio V6'
	             ,description: 'meh meh'
	             ,author: 'zzzzz'
	            }
	  });
	});

	this.io = socket.listen(this.server)
	this.pageNo = 1;
	this.requestLimit = 100;
	this.flickr = new FlickrAPI('63c552ab007e48307f890265611790b7');
	this.photoSearch(1, 10);
};


ClioZoom.prototype.handler = function (req, res) {
	fs.readFile(__dirname + '/public/index.html',
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			res.writeHead(200);
			res.end(data);
		});
}

ClioZoom.prototype.pushPhotoData = function (photo) {
	var photo = photo;
	this.io.sockets.on('connection', function (socket) {
		socket.emit('photos', {photos: photo});	
	});
};


ClioZoom.prototype.getPhotoDetails = function (photoData) {
	var that = this;
	this.flickr._request.executeRequest("flickr.photos.getSizes", {"photo_id": photoData.id}, false, null, function (error, photo) {
		if (error) {
			sys.puts(error);
			return;
		}
		that.pushPhotoData(photo);
	});
};

ClioZoom.prototype.photoSearch = function (pageNo, limit) {
	var that = this,
		i;
	this.flickr.photos.search({tags: 'cliov6'},  function (error, results) {
		for (i = 0; i < results.photo.length; i++) {
			that.getPhotoDetails(results.photo[i], that.pushPhotoData);
		}
	    //sys.puts(sys.inspect(results));
	});
};




var clio = new ClioZoom(io, port, connect, express);
console.log('Listening on http://localhost:' + port );



