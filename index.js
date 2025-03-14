const dropZone = document.querySelector('.drop-zone');
const browseBtn = document.querySelector('.browseBtn');
const fileInput = document.querySelector('#fileInput');
const progressContainer=document.querySelector(".progress-container");
const bgProgress = document.querySelector('.bg-progress');
const progressBar = document.querySelector('.progress-bar');
const percentDiv = document.querySelector('#percent');
const fileURLInput = document.querySelector('#fileUrl');
const sharingContainer = document.querySelector('.sharing-container');
const copyBtn = document.querySelector('#copyBtn');
const emailForm = document.querySelector('#emailForm');
const toast = document.querySelector('.toast');


const host = 'http://localhost:3000/';
const uploadFileURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;


const maxAllowedSize = 100 * 1024 * 1024; //100mb





dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    if(!dropZone.classList.contains('dragged')){
        dropZone.classList.add('dragged');
    }
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragged');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragged');
    const files = e.dataTransfer.files;
    console.log(files);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener('change', () => {
    uploadFile();
});

browseBtn.addEventListener('click', () => {
    fileInput.click();
});

copyBtn.addEventListener('click', () => {
    fileURLInput.select();
    document.execCommand('copy');
    alert('Copied to clipboard');
    showToast('Copied to clipboard');
});

const  uploadFile =()=>{
   

    if(fileInput.files.length > 1){
       resetFileInput();
        showToast('Only upload one file');
        return;
    }
    const file = fileInput.files[0];
    if(file.size > maxAllowedSize){
       resetFileInput();
        showToast('File size exceeds 100mb');
        return;
    }
    progressContainer.style.display = 'block';
    

    emailForm[2].setAttribute('disabled', 'true');
    
    const formData = new FormData();
    formData.append('myFile', file);
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            console.log(xhr.response);
            onUploadSuccess(JSON.parse(xhr.response));

        }
    };
    xhr.upload.onprogress = updateProgress;
   
  xhr.upload.onerror = () => {
     resetFileInput();
      showToast(`Error in network${xhr.statusText}`);   
    } 

    xhr.open('POST', 'upload.php', true);
    xhr.send(formData);
} ;

const updateProgress = (e) => {
    console.log(e);
   if(e.lengthComputable){
       const percentComplete = e.loaded / e.total * 100;
       console.log(percentComplete);
       progressBar.style.transform = percentComplete + '%';
   }
   percentDiv.innerText = Math.round(percentComplete);
};

const onUploadSuccess=({file:url}) => {
  //  const response = file;
  

   // console.log(response);
   console.log(url);
  resetFileInput()
   emailForm[2].removeAttribute('disabled', 'true');
   progressContainer.style.display = 'none';
    sharingContainer.style.display = 'block';
    fileURLInput.value = url;

    
}
const  resetFileInput =()=>{
    fileInput.value = '';
}


emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("submit form");
   const url = fileURLInput.value;
    const formData = {
         uuid: url.split('/').splice(-1,1)[0],
         emailTo: emailForm.elements['from-email'].value,
         emailFrom: emailForm.elements['to-email'].value
    };
    console.table(formData);

    emailForm[2].setAttribute('disabled', 'true');
    fetch(emailURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(({success}) => {
        if(success){
            sharingContainer.style.display = 'none';
            showToast('Email Sent');
        }
    });



 
});
let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = 'translateY(-50%,0)';
    clearTimeout(toastTimer);
    toastTimer= setTimeout(() => {
        toast.style.transform = 'translate(-50%, 60px)';
    }, 2000);
};








