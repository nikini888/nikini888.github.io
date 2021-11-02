function displayFilename() {
    const image = document.querySelector(".inputImg")
    const filenameLabel = document.querySelector(".filenameLabel")
    if (image.files.length > 0) {
        //image.files is not a array, need spread syntax to turn it out
        filenameLabel.textContent = [...image.files].map(file => file.name).join(', ')
    } else {
        filenameLabel.textContent = image.files[0].name
    }
}
