function onSubmit(e) {
    e.preventDefault();
    let customMessage = document.getElementById('message');
    if (validateForm(customMessage)) {
        uploadVideo(customMessage);
    }
}

function validateForm(customMessage) {
    const uploadedFile = document.getElementById('upload').elements[0].files[0];
    if (!uploadedFile) {
        customMessage.innerHTML = "Please select a file to upload";
        return false;
    }
    const fileLimit = 104857600;
    if (uploadedFile.size > fileLimit) {
        customMessage.innerHTML = "Maximum video size allowed: 100MB";
        return false;
    }
    return true;
}

function uploadVideo(customMessage) {
    document.getElementById("submit").disabled = true;
    customMessage.innerHTML = 'uploading video..'
    let formElement = document.getElementById("upload");
    let request = new XMLHttpRequest();
    request.open("POST", "/", true);
    request.onload = onComplete;
    request.upload.onprogress = fileUploadPercentage;
    const data = new FormData(formElement);
    request.send(data);
}

function onComplete(event) {
    let customMessage = document.getElementById('message');
    const response = JSON.parse(event.currentTarget.response);
    console.log(response);
    if (response.success) {
        document.getElementById('main-div').style.display = 'none';
        customMessage.style.color = '#9C27B0';
        customMessage.innerHTML = `Video Uploaded successfully!!. Please <a href=${response.message.link}>click here</a> to view the video.`;
    } else {
        customMessage.innerHTML = response.error;
        customMessage.style.color = 'red';
    }
    // document.getElementById("submit").disabled = false;
}

function fileUploadPercentage(e) {
    if (e.lengthComputable) {
        let customMessage = document.getElementById('message');
        let percentage = (e.loaded / e.total) * 100;
        customMessage.innerHTML = 'Uploading Video: ' + percentage + ' %';
    }
};