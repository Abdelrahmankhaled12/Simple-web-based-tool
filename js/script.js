// URL API
const FETCH_TIP = 'http://127.0.0.1:5000/fetchTip';
const UPLOAD_IMAGE = 'http://127.0.0.1:5000/uploadScreenshot';

// Get Data From LocalStorage
const userData = JSON.parse(localStorage.getItem('Data'));

// Check Login Or Not
if (userData === null) {
    window.location.href = '../index.html';
}

// ACCESS DATA
let data = {
    access_token: userData.access_token,
    username: userData.username
};

// Get Elements
const video = document.getElementById('videoElement');
const captureButton = document.getElementById('captureButton');
const buttonCallApi = document.getElementById('buttonCallApi');
const refresh = document.getElementById('refresh');
const returnButton = document.getElementById('return');
const resultSection = document.getElementById('result');

// Access the camera and stream the video
navigator.mediaDevices
    .getUserMedia({ video: { facingMode: 'environment' } })
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

    // Here you can send imageData to a server or perform further actions
    // For example, display the captured image on the page:
    const capturedImage = new Image();
    capturedImage.id = "img"
    capturedImage.src = imageData;
    document.getElementById("image").appendChild(capturedImage);
    captureButton.style.display = "none"
    buttonCallApi.style.display = "block"
    refresh.style.opacity = "1"


    // In Case Click Button Refresh
    refresh.addEventListener("click", () => {
        // Button Take Picture Show Agian
        captureButton.style.display = "block"
        // Button Tell me Whats-In-It? Hide  Agian
        buttonCallApi.style.display = "none"
        // Button Refresh Hide Agian
        refresh.style.opacity = "0"
        // Remove Image 
        document.getElementById("img").remove()
    })

    fetch(FETCH_TIP, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.access_token}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
        .then(dataTip => {
            document.getElementById("proTipPar").innerHTML = dataTip.tip;
        })


    // In Case Click Button Tell me Whats-In-It?
    buttonCallApi.addEventListener("click", () => {
        buttonCallApi.style.pointerEvents = "none"
        // Change Text Button
        buttonCallApi.innerHTML = "Analysing…"
        // Hide Button Refresh and paragraph 
        refresh.style.opacity = "0"
        document.getElementById("par_click").style.display = "none"
        // Show Pro Tip
        document.getElementById("section_proTip").style.display = "block"
        // Convert the captured image to a Blob
        canvas.toBlob(function (blob) {
            const formData = new FormData();
            formData.append('access_token', userData.access_token);
            formData.append('username', userData.username);
            formData.append('image', blob, 'captured_image.png');

            fetch(UPLOAD_IMAGE, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userData.access_token}`
                },
                body: formData
            })
                .then(res => res.json())
                .then(dataResult => {
                    buttonCallApi.innerHTML = "Here are the Results"
                    document.getElementById("section_proTip").style.display = "none"
                    document.getElementById("result").style.display = "block";
                    returnButton.style.opacity = 1;
                    showResult(dataResult);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }, 'image/png');

        // In Click Button Return
        returnButton.addEventListener("click", () => {
            buttonCallApi.style.pointerEvents = "auto";
            // Remove All Elements In Section Result
            resultSection.innerHTML = ""
            // Change Text [Analysing…] To [Tell me Whats-In-It?] Again
            buttonCallApi.innerHTML = "Tell me Whats-In-It?"
            // Button Take Picture Show Agian
            captureButton.style.display = "block"
            // Button Tell me Whats-In-It? Hide  Agian
            buttonCallApi.style.display = "none"
            // Button Return Hide  Agian
            returnButton.style.opacity = "0"
            // Remove Image
            document.getElementById("img").remove()
            // Show paragraph Again
            document.getElementById("par_click").style.display = "block"
        })
    })
});




// Add Result In Dom
function showResult(result) {
    // Create Div 
    let div = document.createElement("div");
    div.innerHTML =
        `
    <div class="item_1 styleItem styleItem_1">
        <p>This Item Is : </p>
        <ul>
            <li class=${result.item_type.toLowerCase() === "vegan" ? "green" : ""}>Vegan</li>
            <li class=${result.item_type.toLowerCase() === "vegetarian" ? "green" : ""}>Vegetarian</li>
            <li class=${result.item_type.toLowerCase() === "non-veg" ? "red" : ""}>Non-Veg</li>
        </ul>
    </div>
    <div class="item_2 styleItem styleItem_2">
        <p>It contains the following potential allergens: </p>
        <ul>
        ${result.allergens.map(item => (
            `<li>${item}</li>`
        ))}
        </ul>
    </div>
    <div class="item_3 styleItem">
        <p>What about additives and preservatives? </p>
        <ul>
            <li>${result.additives_preservaties}</li>
            <li>${result.additives_preservaties_impact}</li>
        </ul>
    </div>
    <div class="item_4 styleItem styleItem_1">
        <p>According to Ayurveda, this item is: </p>
        <ul>
            <li class=${result.ayurvedic_classification.toLowerCase() === "sattvik" ? "green" : ""}>Sattvik</li>
            <li class=${result.ayurvedic_classification.toLowerCase() === "tamsik" ? "yellow" : ""}>Tamsik</li>
            <li class=${result.ayurvedic_classification.toLowerCase() === "rajsik" ? "red" : ""}>Rajsik</li>
        </ul>
    </div>
    <div class="item_5 styleItem styleItem_1">
        <p>This item is: </p>
        <ul>
            <li class=${result.acidic_alkaline_classification.toLowerCase() === "highly acidic" ? "red" : ""}>Highly <br> Acidic</li>
            <li class=${result.acidic_alkaline_classification.toLowerCase() === "moderately acidic" ? "red" : ""}>Moderately <br> Acidic</li>
            <li class=${result.acidic_alkaline_classification.toLowerCase() === "moderately alkaline" ? "green" : ""}>Moderately <br> Alkaline</li>
            <li class=${result.acidic_alkaline_classification.toLowerCase() === "highly alkaline" ? "green" : ""}>Highly <br> Alkaline</li>
        </ul>
    </div>
    <div class="item_6 styleItem styleItem_1">
        <p>How is this item for your gut bacteria? </p>
        <ul>
            <li class=${result.gut_bacteria.toLowerCase() === "not so friendly" ? "red" : ""}>Not so friendly</li>
            <li class=${result.gut_bacteria.toLowerCase() === "friendly" ? "green" : ""}>Friendly</li>
        </ul>
    </div>
    <div class="item_7 styleItem">
        <p>What are the health benefits of this item ? </p>
        <ul>
            <li class="content">${result.health_benefits}</li>
        </ul>
    </div>
    <div class="item_8 styleItem styleItem_2">
        <p>This item may not be ideal for you if you have: </p>
        <ul>
        ${result.health_conditions.map(item => (
            `<li>${item}</li>`
        ))}
        </ul>
    </div>
    <div class="item_9 styleItem styleItem_1">
        <p>How is this item for the environment? </p>
        <ul>
            <li class=${result.environment_sustainability.toLowerCase() === "bad" ? "red" : ""}>Bad</li>
            <li class=${result.environment_sustainability.toLowerCase() === "neutral" ? "yellow" : ""}>Neutral</li>
            <li class=${result.environment_sustainability.toLowerCase() === "safe" ? "green" : ""}>Safe</li>
        </ul>
    </div>    
    <div class="item_3 styleItem">
        <p>The above results are based on the following ingredients we got from the pic you shared: </p>
        <ul>
        ${result.ingredients.map(item => {
            item = item.replace(/\s/g, '');
            item = item.slice(0, item.length - 1)
            return (`<li>${item}</li>`)
        })}
        </ul>
    </div>
    `
    resultSection.append(div)
}
