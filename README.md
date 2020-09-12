# 🔍 UnTab

**UnTab is a productivity tool to boost your browser workflow!**  
Most of us have dozens of open tabs, and it quickly becomes cumbersome to manage them efficiently. UnTab is a browser extension that gives you superpowers by making it possible to search through open tabs and perform common actions with just a few strokes. This in turn boosts productivity and makes you look like a hero!

Currently, UnTab is being built as a browser extension for Chrome and Chromium based browsers.

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

- `rollup.confis.js`: Project build configuration is setup using rollup.

### Build the project
To install the extension on the browser, first build the project using the following command.
```bash
npm run build
```
All the built files are generated in the `dist` directory.

### Install on Browser
- Go to the extensions page on your browser. For Chrome and Chromium based browsers go to `chrome://extensions`
- Turn ON `Developer mode`
- Click on `Load Unpacked`
- Select the `dist` folder that was generated after the build step. The extension should now sho up on the list
- NOTE: Whenever, the build files are changed, to get the changes synced with the installed extension, click on the reload icon next to the installed extension.

## License 
UnTab is [MIT Licensed](https://github.com/blenderskool/untab/blob/master/LICENSE)
