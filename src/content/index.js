const frame = document.createElement('iframe');
frame.classList.add('untab');
frame.src = chrome.runtime.getURL('index.html');

document.body.append(frame);
