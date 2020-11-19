import constants from '../constants';

const frame = document.createElement('iframe');
frame.classList.add('untab');
frame.src = browser.runtime.getURL('index.html');

document.body.append(frame);

browser.runtime.onMessage.addListener((req) => {
  switch(req.type) {
    case constants.OPEN:
      frame.classList.add('visible');
      break;
  }

  frame.contentWindow.postMessage(req, '*');
});

window.addEventListener('message', (e) => {
  if (frame.contentWindow !== e.source) return;

  document.activeElement.blur();
  frame.classList.remove('visible');
});