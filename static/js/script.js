var app = app || {};
(function(app){
	app = {
		socket : io.connect("http://localhost:8081"),
		target : document.getElementsByTagName('section')[0],
		init : function () {
			app.pushData();
		},
		pushData : function (){
			app.socket.on('photos', function (data) {
				app.setAttr(data)
			  });
		},
		setAttr : function (data) {
			var size = 4,
				height = data.photos.size[size].height,
				width = data.photos.size[size].width,
				link = document.createElement('a')
				img = new Image();

			link.href = data.photos.size[size].url
			link.setAttribute('href',data.photos.size[size].url);
			img.src = data.photos.size[size].source;

			img.height = height;
			link.appendChild(img)

			app.loadImageEvnt(img, link, height)

		},
		loadImageEvnt : function (img, link, height) {
			img.onload = function(){
				document.body.style.backgroundImage = "none"
				app.target.appendChild(link)
				link.style.opacity = 1;
				link.height = height;
			}
		},
		
	}


	
	return app


	
}().init());

