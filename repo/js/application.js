
var socket = io.connect(),
	target = document.getElementsByTagName('section'),
	targetWidth = 0;
	socket.on('photos', function (data) {
		var size = 4,
			height = data.photos.size[size].height,
			width = data.photos.size[size].width,
			link = document.createElement('a')
			img = new Image();
		

		targetWidth = targetWidth + parseFloat(data.photos.size[size].width);
		
		link.href = data.photos.size[size].url
		link.setAttribute('href',data.photos.size[size].url);
		img.src = data.photos.size[size].source;
		img.width = width;
		img.height = height;
		link.appendChild(img)
		link.onmouseover = function(){
			console.log('over', this)
			this.style.width = width + 'px'
			this.style.height = height + 'px'
		}
		link.onmouseout = function(){
			console.log("out", this)
			this.style.width = '200px'
			this.style.height = '300px'
			
		}
		
		img.onload = function(){
			target[0].style.width = targetWidth + 'px';
			document.body.style.backgroundImage = "none"
			target[0].appendChild(link)
			link.style.opacity = 1;
			link.height = height;
		}




	  });




