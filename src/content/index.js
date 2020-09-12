import constants from '../constants';

const frame = document.createElement('iframe');
frame.classList.add('untab');
frame.src = chrome.runtime.getURL('index.html');

document.body.append(frame);

chrome.runtime.onMessage.addListener((req) => {
  switch(req.type) {
    case constants.OPEN:
      frame.style.visibility = 'visible';
      frame.style.opacity = 1;
      break;
  }
});
