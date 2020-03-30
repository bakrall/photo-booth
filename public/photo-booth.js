const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

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
	}, 16);
}

function takePhoto() {
	//take the data out of canvas
	const data = canvas.toDataURL('image/jpeg');
	const link = document.createElement('a');
	link.href = data;
	link.setAttribute('download', 'image title');
	link.textContent = 'Download Image';
	strip.insertBefore(link, strip.firstChild);
}

getVideo();

video.addEventListener('canplay', paintToCanvas);