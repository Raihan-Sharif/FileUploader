
/** Configuration for file upload */
const FileUploadConfig = {
    Allowed_Types: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "txt", "ppt", "pptx", "xls", "xlsx", "mp4", "avi", "wmv", "mov", "mkv", "mp3"],
    Max_File_Size: 5 * 1024 * 1024, // 5MB in bytes
    Max_Img_Size: 1 * 1024 * 1024, // 1MB in bytes
    Image_Path: "\\Uplaod\\Images",
    File_Path: "\\Uplaod\\Files",
    Is_Dragable: true,
    Is_Multiple_Upload: true
};


/**
 * Function to validate a file based on the configuration
 * @param {any} file
 * @returns
 */
function validateFile(file) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileSize = file.size;

    if (!FileUploadConfig.Allowed_Types.includes(fileExtension)) {
        return "File type not allowed.";
    }

    if (fileSize > FileUploadConfig.Max_File_Size) {
        return "File size exceeds the allowed limit.";
    }

    if (fileExtension.match(/jpg|jpeg|png|gif/) && fileSize > FileUploadConfig.Max_Img_Size) {
        return "Image size exceeds the allowed limit.";
    }

    return "File is valid.";
}



// Example usage:
const uploadedFile = {
    name: "example.jpg",
    size: 2000000 // 2 MB
};

const validationResult = validateFile(uploadedFile);
console.log(validationResult); // Output: "File is valid."

/**
 * Common function to handle file uploads
 * @param {any} files
 */
function handleFiles(files) {
    console.log('handle files called.');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const fileName = file.name.split('.')[0];
        const fileSize = getFileSize(file);
        const fileType = getFileType(file);
        var fileSource = URL.createObjectURL(file);
        const thumbnail = fileSource;
        var imgDimension = '';
        // Generate a unique key for the file
        const uniqueKey = generateUniqueKey();
        if (isImage(file)) {

            getImageSize(fileSource)
                .then(size => {
                    imgWidthPx = size.width + 'px';
                    imgHeightPx = size.height + 'px';

                    imgDimension = 'Width: ' + imgWidthPx + ' Height: ' + imgHeightPx;
                    console.log('fileSource', fileSource);
                    // Call any functions that depend on the image size here
                    generateNewRow(thumbnail, fileName, fileType, fileSize, imgDimension, uniqueKey);
                    // Now Enable upload button to upload the files.
                    document.getElementById("uploadBtn").disabled = false;

                })
                .catch(err => {
                    console.error(err);
                });
        }
        else {
            // if the file is not an image, then show the respective file thumbnail.
            fileSource = getThumbnailByFileType(file);
            generateNewRow(fileSource, fileName, fileType, fileSize, imgDimension, uniqueKey);
        }

        // Add the file to the selectedFiles object with its unique key
        selectedFiles[uniqueKey] = file;
    }
}

/** Prepeare the upload files before uploading like image corp to default size or compress the image/file size */
function prepareUplodFiles() {
    if (cropper) {

        console.log("cropped is not null.");

        // Get the cropped image data
        var canvas = cropper.getCroppedCanvas({
            width: 200,
            height: 200
        });
        canvas.toBlob(function (blob) {
            // Create a FormData object and add the cropped image file to it
            var formData = new FormData();
            formData.append('file', blob, 'cropped.jpg');
            uploadData(formData);
        });
    }
    else {
        console.log("cropped is null.");


        // Loop through the selectedFiles object and get the individual files
        for (const key in selectedFiles) {
            const file = selectedFiles[key];
            console.log(`File name: ${file.name}, File type: ${file.type}, File size: ${file.size}`);

            var formData = new FormData();
            formData.append("file", file);

            uploadData(formData, key, file.name);
        }


        //var fileInput = $('#file');
        //var selectedFile = fileInput[0].files[0];

        //var formData = new FormData();
        //formData.append("file", selectedFile);

        //uploadData(formData);


    }
}

/**
 * this funciton for post data to server.
 * @param {any} formData
 * @param {any} uniqueKey
 * @param {any} fileName
 */
function uploadData(formData, uniqueKey, fileName) {
    console.log('uploadData Called.', formData);
    // Get the progress bar and progress text from the table row to show the progress status.
    var progressText = document.getElementById("progressText_" + uniqueKey);
    var progressBar = document.getElementById("progressBar_" + uniqueKey);
    // Send the file to the server using AJAX
    $.ajax({
        url: '/api/File/Upload',
        type: 'POST',
        data: formData,
        headers: { "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val() },
        cache: false,
        contentType: false,
        processData: false,
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener('progress', function (evt) {
                if (evt.lengthComputable) {

                    var percentComplete = evt.loaded / evt.total;
                    var progressStatus = Math.floor(percentComplete * 100).toString() + '%';

                    // Update the innerHTML property to insert the desired text
                    progressText.innerHTML = progressStatus;
                    progressBar.style.width = progressStatus;
                }
            }, false);
            return xhr;
        },
        success: function (data, textStatus, jqXHR) {
            //alert('File uploaded successfully. URL: ' + response.url)
            if (textStatus == 'success') {
                var errorTitle = 'File uploaded successfully. <br/> File: ' + fileName;
                sendAlert('success', errorTitle);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

            progressText.innerHTML = '0%';
            progressBar.style.width = '0%';
            var errorTitle = jqXHR.responseText + ' <br/> File: ' + fileName;
            sendAlert('danger', errorTitle);
        }
    });
}

/**
 * check the file is image or not.
 * @param {any} file
 * @returns
 */
function isImage(file) {
    // Check if the file type starts with "image/"
    return file.type.startsWith("image/");
}

/**
 * Delete File berfore submit to server by user.
 * @param {any} callingObject
 */
function deleteFile(callingObject) {
    // Get the tag name of the calling object
    const tagName = callingObject.tagName;

    // Get the ID of the calling object
    const id = callingObject.id;

    // Get the text content of the calling object
    const textContent = callingObject.textContent;



    var row = $(callingObject).closest('tr');
    var imgSrc = $(row).find('img').attr('src');

    alert('File deleted: ' + imgSrc);

    $(row).remove();

    // file delete form array
    if (getFileByKey(id.replace("delete_", ""))) {
        deleteFileByKey(id.replace("delete_", ""))
    }
    else {
        console.log('file Key: ', id.replace("delete_", ""));
        sendAlert('danger', "File not found to delete!");
    }

    // Log the details to the console
    console.log(`Tag name: ${tagName}`);
    console.log(`ID: ${id}`);
    console.log(`Text content: ${textContent}`);
    console.log(`imgSrc: ${imgSrc}`);


    // Get the table element and its tbody
    const tbody = document.getElementById("filesTableBody");

    // Check if tbody has any rows
    if (tbody.rows.length > 0) {
        // If there are rows, enable the upload button
        document.getElementById("uploadBtn").disabled = false;
    } else {
        // If there are no rows, disable the upload button
        document.getElementById("uploadBtn").disabled = true;
    }

}

/**
 * Get the file size
 * @param {any} file
 * @returns
 */
function getFileSize(file) {
    var fileSizeInBytes = file.size;
    var fileSizeInKB = fileSizeInBytes / 1024;
    if (fileSizeInKB < 1024) {
        return fileSizeInKB.toFixed(2) + ' KB';
    } else {
        var fileSizeInMB = fileSizeInKB / 1024;
        return fileSizeInMB.toFixed(2) + ' MB';
    }
}

/**
 * Get the file type
 * @param {any} file
 * @returns
 */
function getFileType(file) {
    const type = file.type;
    if (type.startsWith('image/')) {
        return 'image';
    } else if (type.startsWith('video/')) {
        return 'video';
    } else if (type.startsWith('audio/')) {
        return 'audio';
    } else if (type.startsWith('application/pdf')) {
        return 'pdf';
    } else if (type.startsWith('application/msword') || type.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        return 'word';
    } else if (type.startsWith('application/vnd.ms-excel') || type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        return 'excel';
    } else if (type.startsWith('application/vnd.ms-powerpoint') || type.startsWith('application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
        return 'powerpoint';
    } else if (type.startsWith('text/')) {
        return 'text';
    } else {
        return 'other';
    }
}

/**
 * Get the thumnail for show by the file type.
 * @param {any} file
 * @returns
 */
function getThumbnailByFileType(file) {
    const type = file.type;
    if (type.startsWith('image/')) {
        return '/assets/media/svg/files/image-document.svg';
    } else if (type.startsWith('video/')) {
        return '/assets/media/svg/files/video-document.svg';

    } else if (type.startsWith('audio/')) {
        return '/assets/media/svg/files/audio-document.svg';

    } else if (type.startsWith('application/pdf')) {
        return '/assets/media/svg/files/pdf-document.svg';

    } else if (type.startsWith('application/msword') || type.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        return '/assets/media/svg/files/word-document.svg';

    } else if (type.startsWith('application/vnd.ms-excel') || type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        return '/assets/media/svg/files/excel-document.svg';

    } else if (type.startsWith('application/vnd.ms-powerpoint') || type.startsWith('application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
        return '/assets/media/svg/files/ppt-document.svg';

    } else if (type.startsWith('text/')) {
        return '/assets/media/svg/files/txt-document.svg';

    } else {
        return '/assets/media/svg/files/unknown-document.svg';

    }
}

/**
 * Get the image size
 * @param {any} fileSource
 * @returns
 */
function getImageSize(fileSource) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const size = {
                width: img.width,
                height: img.height,
            };
            resolve(size);
        };
        img.onerror = reject;
        img.src = fileSource;
    });
}

/**
 * Generate new row to show the uploaded files in the upload section
 * @param {any} fileSource
 * @param {any} fileName
 * @param {any} fileType
 * @param {any} fileSize
 * @param {any} imgDimension
 * @param {any} uniqueKey
 */
function generateNewRow(fileSource, fileName, fileType, fileSize, imgDimension, uniqueKey) {

    // Get the table body element by ID
    var tableBody = $("#filesTableBody");;

    // Your prepared string row
    var newRow = '<tr>' +
        '<td>' +
        '    <div class="form-check form-check-sm form-check-custom form-check-solid">' +
        '        <input class="form-check-input widget-9-check" type="checkbox" value="1" />' +
        '    </div>' +
        '</td>' +
        '<td>' +
        '    <div class="d-flex align-items-center">' +
        '        <div class="symbol symbol-45px me-5">' +
        '            <img src="' + fileSource + '" alt="" />' +
        '        </div>' +
        '        <div class="d-flex justify-content-start flex-column">' +
        '            <span class="text-dark fw-bolder text-hover-primary fs-6">' + fileName + '</span>' +
        '            <span class="text-muted fw-bold text-muted d-block fs-7">' + fileSize + '</span>' +
        '        </div>' +
        '    </div>' +
        '</td>' +
        '<td>' +
        '    <span class="text-dark fw-bolder text-hover-primary d-block fs-6">' + fileType + '</span>' +
        '    <span class="text-muted fw-bold text-muted d-block fs-7">' + imgDimension + '</span>' +
        '</td>' +
        '<td class="text-end">' +
        '    <div class="d-flex flex-column w-100 me-2">' +
        '        <div class="d-flex flex-stack mb-2">' +
        '            <span id="progressText_' + uniqueKey + '" class="text-muted me-2 fs-7 fw-bold" progress-text>0%</span>' +
        '        </div>' +
        '        <div class="progress h-6px w-100">' +
        '            <div id="progressBar_' + uniqueKey + '" class="progress-bar bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>' +
        '        </div>' +
        '    </div>' +
        '</td>' +
        '<td>' +
        '    <div class="d-flex justify-content-end flex-shrink-0">' +
        '        <a href="#" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">' +
        '            <!--begin::Svg Icon | path: icons/duotune/art/art005.svg-->' +
        '            <span class="svg-icon svg-icon-3">' +

        '               <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#7d7e82"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 22H3C2.59 22 2.25 21.66 2.25 21.25C2.25 20.84 2.59 20.5 3 20.5H21C21.41 20.5 21.75 20.84 21.75 21.25C21.75 21.66 21.41 22 21 22Z" fill="#f7ab08"></path> <path d="M19.0206 3.48162C17.0806 1.54162 15.1806 1.49162 13.1906 3.48162L11.9806 4.69162C11.8806 4.79162 11.8406 4.95162 11.8806 5.09162C12.6406 7.74162 14.7606 9.86162 17.4106 10.6216C17.4506 10.6316 17.4906 10.6416 17.5306 10.6416C17.6406 10.6416 17.7406 10.6016 17.8206 10.5216L19.0206 9.31162C20.0106 8.33162 20.4906 7.38162 20.4906 6.42162C20.5006 5.43162 20.0206 4.47162 19.0206 3.48162Z" fill="#f7ab08"></path> <path d="M15.6103 11.5308C15.3203 11.3908 15.0403 11.2508 14.7703 11.0908C14.5503 10.9608 14.3403 10.8208 14.1303 10.6708C13.9603 10.5608 13.7603 10.4008 13.5703 10.2408C13.5503 10.2308 13.4803 10.1708 13.4003 10.0908C13.0703 9.81078 12.7003 9.45078 12.3703 9.05078C12.3403 9.03078 12.2903 8.96078 12.2203 8.87078C12.1203 8.75078 11.9503 8.55078 11.8003 8.32078C11.6803 8.17078 11.5403 7.95078 11.4103 7.73078C11.2503 7.46078 11.1103 7.19078 10.9703 6.91078C10.9491 6.86539 10.9286 6.82022 10.9088 6.77532C10.7612 6.442 10.3265 6.34455 10.0688 6.60231L4.34032 12.3308C4.21032 12.4608 4.09032 12.7108 4.06032 12.8808L3.52032 16.7108C3.42032 17.3908 3.61032 18.0308 4.03032 18.4608C4.39032 18.8108 4.89032 19.0008 5.43032 19.0008C5.55032 19.0008 5.67032 18.9908 5.79032 18.9708L9.63032 18.4308C9.81032 18.4008 10.0603 18.2808 10.1803 18.1508L15.9016 12.4295C16.1612 12.1699 16.0633 11.7245 15.7257 11.5804C15.6877 11.5642 15.6492 11.5476 15.6103 11.5308Z" fill="#f7ab08"></path> </g></svg>' +

        '            </span>' +
        '            <!--end::Svg Icon-->' +
        '        </a>' +
        '        <button id="delete_' + uniqueKey + '" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm" onclick="deleteFile(this)">' +
        '            <!--begin::Svg Icon | path: icons/duotune/general/gen027.svg-->' +
        '            <span class="svg-icon svg-icon-3">' +
        '                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '                <path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill = "black" />' +

        '                  <path opacity="0.5" d = "M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill = "black" />' +
        '                  <path opacity="0.5" d = "M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill = "black" />' +
        '                </svg>' +
        '            </span>' +
        '            <!--end::Svg Icon-->' +
        '        </button>' +
        '    </div>' +
        '</td>' +
        '</tr>';

    // Append the new row to the table body
    tableBody.append(newRow);

}

/**
 * Get current time as string
 * @returns
 */
function getCurTimeString() {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');

    const timeString = hour + minute + second;
    return timeString;
}

/**
 * Function to generate a unique key for the file
 * @returns
 */
function generateUniqueKey() {
    // Generate a random string using Math.random() and convert it to base 36
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // Combine the current timestamp and the random string to create the unique key
    const uniqueKey = `file_${new Date().getTime()}_${randomString}`;
    return uniqueKey;
}

/**
 * Function to get a file by its unique key
 * @param {any} key
 * @returns
 */
function getFileByKey(key) {
    console.log('selectedFiles: ', selectedFiles);

    console.log('key: ', key);

    return selectedFiles[key];
}

/**
 * Function to delete a file by its unique key
 * @param {any} key
 */
function deleteFileByKey(key) {
    delete selectedFiles[key];
}

