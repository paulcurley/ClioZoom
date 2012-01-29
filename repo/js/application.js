

window.onload = function(){

	var socket = io.connect(),
		target = document.getElementsByTagName('section'),
		loader = document.getElementById('load') ,
		pageNo = 2;
  		socket.on('photos', function (data) {
			
			
			var size = 5,
				height = data.photos.size[size].height,
				width = data.photos.size[size].width,
				link = document.createElement('a')
				img = new Image();
				
			link.href = data.photos.size[size].url
			link.setAttribute('href',data.photos.size[size].url);
			img.src = data.photos.size[size].source;
			//console.log(img)

			link.appendChild(img)
			img.onload = function(){
				//
				//console.log('dsa')
				document.body.style.backgroundImage = "none"
				target[0].appendChild(link)
				
				setTimeout(function() {
					link.style.opacity = 1;
					link.width = width;
					link.height = height;
				}, 10);
			}
			

			

		  });
		
	
}

