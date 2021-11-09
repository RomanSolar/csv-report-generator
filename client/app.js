const errorDisplay = document.getElementById('error');
const filePicker = document.getElementById('file');
const outputDisplay = document.getElementById('csv');
outputDisplay.rows = outputDisplay.value.split('\n').length;

document.getElementById('submit').onclick = async () => {
  try {
    errorDisplay.innerText = '';
    const file = await readFile(filePicker.files[0]);
    const csv = await request('POST', '/', file);
    outputDisplay.rows = csv.split('\n').length;
    outputDisplay.value = csv;
    filePicker.value = '';
  } catch (e) {
    errorDisplay.innerText = e;
  }
};

// Async helpers

const request = (method, url, data = null) => new Promise((resolve, reject) => {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.onerror = () => reject();
  req.onload = (event) => {
    const {response, status, statusText} = event.target;
    if (status === 0 || status >= 200 && status < 400) {
      resolve(response);
    } else {
      reject(statusText);
    }
  };
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  req.send(data);
});

const readFile = (file) => new Promise((resolve, reject) => {
  if (!file) {
    reject('invalid file');
    return;
  }

  const reader = new FileReader();

  reader.onerror = () => reject(reader.error);
  reader.onload = (event) => resolve(event.target.result);

  reader.readAsText(file);
});
