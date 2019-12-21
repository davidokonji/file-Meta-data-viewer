const { ipcRenderer } = require("electron");

const submitListener = document
.querySelector('form')
.addEventListener('submit', (event) => {
  event.preventDefault();

  const files = [...document.getElementById('filepicker').files];

  const filesformatted = files.map(({name, path: pathName}) => ({
    name,
    pathName
  }));

  ipcRenderer.send('files', filesformatted);
});

ipcRenderer.on('metadata', (event, metadata) => {
  const pre = document.querySelector('#data');
  const title = document.querySelector('title');

  pre.innerText = JSON.stringify(metadata, null, 2);
  metadata.length > 1 ?
  title.innerText = `${metadata[0].name} Properties and others....`
  : title.innerText = `${metadata[0].name} Properties`;
});

ipcRenderer.on('metadata:error', (event, error) => {
  console.log(error);
})
