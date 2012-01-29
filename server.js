var FlickrAPI= require('./node_modules/flickrnode/lib/flickr').FlickrAPI,
	sys= require('sys')
	//,
	//socket = require('./node_modules/socket.io');



var ClioZoom = function(socket){
	this.app = require('express').createServer();
	//this.app = require('http').createServer(handler);
	this.app.get('/', function (req, res) {
	  res.sendfile(__dirname + '/index.html');
	});
	this.io = require('socket.io').listen(this.app)

	this.app.listen(3000);
	
	console.log('go go go go')
//	this.io = io = require('./node_modules/socket.io').listen(8253);
	//console.log(this.io)
	this.pageNo = 1;
	this.requestLimit = 100;
	this.flickr= new FlickrAPI('63c552ab007e48307f890265611790b7');
	//this.openSocket();
	this.photoSearch(1, 10);
	
};

ClioZoom.prototype.pushPhotoData = function(photo){
//	console.log(this)
	
	var photo = photo;
	console.log(photo);
	this.io.sockets.on('connection', function (socket) {

		socket.emit('photos', {photos:photo});	

	  
	});
	
};

ClioZoom.prototype.pullPhotoData = function(){
	
};

ClioZoom.prototype.getPhotoDetails = function(photoData, callback){
	var that = this

	this.flickr._request.executeRequest("flickr.photos.getSizes", {"photo_id":photoData.id}, false, null, function(error, photo){
		if (error) {
			console.log(error)
			return;
		};
		//sys.puts(sys.inspect(photo));
		//that[callback](photo);
		console.log(photo)
		that.pushPhotoData(photo)
	});
	
	
};

ClioZoom.prototype.photoSearch = function(pageNo, limit){
	// Search for photos with a tag of 'badgers'
	var that = this;
	this.flickr.photos.search({tags:'cliov6'},  function(error, results) {
		for (var i=0; i < results.photo.length; i++) {
			console.log(i)
			that.getPhotoDetails(results.photo[i])
			
			//that.pushPhotoData(photo)

		};
	    //sys.puts(sys.inspect(results));
	});
};



ClioZoom.prototype.openSocket = function(){
	var that = this;
	
	this.io.sockets.on('connection', function (socket) {
		ClioZoom.prototype.socket = socket;
		

	  
	});
	
};


var clio = new ClioZoom();