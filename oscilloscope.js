const video = document.getElementById("videoPlayer");
const canvas = document.getElementById("oscilloscope");
const canvasCtx = canvas.getContext("2d");

const audioContext = new AudioContext();
const audioSource = audioContext.createMediaElementSource(video);
const analyser = audioContext.createAnalyser();

audioSource.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 2048;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawOscilloscope() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "#ffffff";

  canvasCtx.beginPath();

  const sliceWidth = (canvas.width * 1.0) / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();

  requestAnimationFrame(drawOscilloscope);
}

video.addEventListener("play", () => {
  audioContext.resume();
  drawOscilloscope();
});
