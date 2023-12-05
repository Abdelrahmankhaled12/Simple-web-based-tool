// Get Elements 
const video = document.getElementById('videoElement');
const captureButton = document.getElementById('captureButton');
const buttonCallApi = document.getElementById('buttonCallApi');
const refresh = document.getElementById('refresh');
const returnButton = document.getElementById('return');


// Access the camera and stream the video
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(function (stream) {
        video.srcObject = stream;
    })
    .catch(function (error) {
        console.error('Error accessing the camera:', error);
    });

// Capture image when the button is clicked
captureButton.addEventListener('click', function () {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the captured image to base64 format
    const imageData = canvas.toDataURL('image/png');
    console.log('Captured Image:', imageData);

    // Here you can send imageData to a server or perform further actions
    // For example, display the captured image on the page:
    const capturedImage = new Image();
    capturedImage.id = "img"
    capturedImage.src = imageData;
    document.getElementById("image").appendChild(capturedImage);
    captureButton.style.display = "none"
    buttonCallApi.style.display = "block"
    refresh.style.opacity = "1"
    refresh.addEventListener("click", () => {
        captureButton.style.display = "block"
        buttonCallApi.style.display = "none"
        refresh.style.opacity = "0"
        document.getElementById("img").remove()
    })

    buttonCallApi.addEventListener("click",()=> {
        buttonCallApi.innerHTML = "Analysing…"
        refresh.style.opacity = "0"
        document.getElementById("par_click").style.display = "none"
        document.getElementById("section_proTip").style.display = "block"

        setTimeout(()=> {
            buttonCallApi.innerHTML = "Result"
            document.getElementById("section_proTip").style.display = "none"
            document.getElementById("result").style.display = "block";
            returnButton.style.opacity = 1;
        },5000)

        returnButton.addEventListener("click", ()=> {
            buttonCallApi.innerHTML = "Tell me Whats-In-It?"
            captureButton.style.display = "block"
            buttonCallApi.style.display = "none"
            returnButton.style.opacity = "0"
            document.getElementById("img").remove()
            document.getElementById("result").style.display = "none";
            document.getElementById("par_click").style.display = "block"


        })

    })
});