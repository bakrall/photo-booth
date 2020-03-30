const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const takePhotoButton = document.querySelector('.take-photo');

function getVideo() {
	navigator.mediaDevices.getUserMedia({ video: true, audio: false }) //it returns a promise
	.then(localMediaStream => {
		video.srcObject = localMediaStream;
		video.play(); //once the video starts playing, it emits an event 'canplay'
	})
	.catch(err => {
		console.error('you should allow camera', err);
	})
}

function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;

	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);
		//take the pixels out
		let pixels = ctx.getImageData(0, 0, width, height);
		//change them
		pixels = redEffect(pixels);
		//put them back
		ctx.putImageData(pixels, 0, 0);
	}, 16);
}

function takePhoto() {
	//take the data out of canvas
	const data = canvas.toDataURL('image/jpeg');
	const link = document.createElement('a');
	link.href = data;
	link.setAttribute('download', 'image title');
	link.innerHTML = `<img src="${data}" alt="some text" />`
	strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
	for (let i = 0; i < pixels.data.length; i+=4) {
		pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
		pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
	}
	return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
takePhotoButton.addEventListener('click', takePhoto);