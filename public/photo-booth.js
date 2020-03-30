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
		// pixels = redEffect(pixels);
		// pixels = rgbSplit(pixels);

		pixels = greenScreen(pixels);
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

function rgbSplit(pixels) {
	for (let i = 0; i < pixels.data.length; i+=4) {
		pixels.data[i - 150] = pixels.data[i + 0]; //red
		pixels.data[i + 100] = pixels.data[i + 1]; //green
		pixels.data[i - 150] = pixels.data[i + 2]; //blue
	}
	return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

	//if it is anywhere in between min and max ..
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // .. we take it out! - the fourth pixel is the alpha (transparency)
      pixels.data[i + 3] = 0; // set to 0 will be totally transparent
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
takePhotoButton.addEventListener('click', takePhoto);