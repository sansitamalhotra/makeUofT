const video = document.getElementById("camera");
const canvas = document.getElementById("snapshot");
const resultBox = document.getElementById("result");

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("Camera error:", err));

async function captureAndSend() {
    const prompt = document.getElementById("prompt").value;

    // Capture image
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("image", blob, "capture.png");

    resultBox.textContent = "Analyzing...";

    const res = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    resultBox.textContent = data.result || "No result";
}
