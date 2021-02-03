<div align="center">
  <img src="https://getuntab.now.sh/assets/logo_purple.svg" alt="🔍 UnTab" />
  <h3>A productivity tool to boost your browser workflow!</h3>
  <p>
    <i><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Space</kbd> and boom :tada:!</i>
  </p>
  <p>
    <a href="https://fossunited.org"><img src="http://fossunited.org/files/fossunited-badge.svg" alt="Supported by FOSS United" /></a>
  </p>
</div>

Most of us have dozens of open tabs, and it quickly becomes cumbersome to manage them efficiently. UnTab is a browser extension that gives you superpowers by making it possible to search through open tabs and perform common actions with just a few keystrokes. This in turn boosts productivity and makes you look like a hero!

Currently, UnTab is being built as a browser extension for Chrome and Chromium based browsers. All features work on Firefox too except for favicons which would be solved in the coming days.

## Demo
![UnTab](https://user-images.githubusercontent.com/21107799/93019393-4fed5280-f5f4-11ea-9b29-14b802c589c3.gif)

## Project Setup
### Clone the repository
```bash
git clone https://github.com/blenderskool/untab.git
cd untab
```

### Understanding the directory structure
- `src`: Primary source directory where the magic happens!
  - `background`: Background Script for the extension
  - `content`: Content Script for the extension
  - `components`: UI components written using [Svelte](https://svelte.dev). (App.svelte is the main root component)
  - `manifest.json`: Extension manifest file
  
- `dist`: This directory contains the built files from the `src`

- `rollup.config.js`: Project build configuration is setup using rollup.

### Build the project
To install the extension on the browser, first build the project using the following command.

#### Chrome and other Chromium based browsers
```bash
npm run build
```

#### Firefox
```bash
npm run build:firefox
```

All the built files are generated in the `dist` directory.

### Install on Browser

#### Chrome and other Chromium based browsers
- Go to `chrome://extensions`.
- Turn ON `Developer mode`.
- Click on `Load Unpacked`.
- Select the `manifest.json` file in `dist` folder that was generated after the build step. The extension should now show up on the list.
- Go to any page and press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Space</kbd> or <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>Space</kbd> (on Mac) to open UnTab.
- NOTE: Whenever, the build files are changed, to get the changes synced with the installed extension, click on the reload icon next to the installed extension.

#### Firefox
- Go to `about:debugging` and select `This Firefox` on the left sidebar.
- Click on `Load Temporary Add-on...` button.
- Select the `manifest.json` file in `dist` folder that was generated after the build step. The extension should now show up on the list.
- Go to any page and press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Space</kbd> or <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>Space</kbd> (on Mac) to open UnTab.
- NOTE: Whenever, the build files are changed, to get the changes synced with the installed extension, click on the `Reload` button in the extension that was installed in the 3rd step.

## Privacy and Analytics
- UnTab **does not store or send** anything searched/selected in UnTab interface to a server.
- The search index(which includes opened tabs, recent browser history, bookmarks, etc.) prepared by UnTab is generated on the client side everytime and is **never sent or stored** in a server.

### Analytics
Analytics is kept to a minimum and [Google Measurement protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1) is being used for these basic analytics. Unlike the regular Google Analytics used on websites, Google Measurement protocol only records the data explicitly defined in code.
- Browser UserAgent is recorded.
- Browser location is recorded.
- Fingerprinting or Returning browser sessions are **not recorded**.

Following **events** are tracked:
- Opening the UnTab interface.
- Selecting some item in the UnTab interface.  
  (NOTE: The content itself in any form is **not sent**, just an indication that above event occurred)


## License 
UnTab is [MIT Licensed](https://github.com/blenderskool/untab/blob/master/LICENSE)
