# Contributing to UnTab

It's great to have you on board with us to build UnTab extension. This document contains all the necessary documentation to get you started with contributing to UnTab project.

### Table of contents
- [Terminologies](#terminologies)
- [Contributing to Code](#contributing-to-code)
- [Contributing a Plugin](#contributing-a-plugin)
- [Contributing a Theme](#contributing-a-theme)

## Terminologies
Before you start contributing to UnTab code base, it is important to get yourself familiar with some of these terminologies:
- **UnTab interface:** UnTab interface is the nice search interface that is shown after pressing <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Space</kbd>.
- **UnTab plugins(or simply plugins):** Plugins in UnTab are independent modules of code that add extra functionality to UnTab. Example: There is a separate plugin to search for tabs, another plugin to search browser history and so on. Most of the searchable content is generated from plugins.
- **UnTab themes:** Themes in UnTab provide unique looks to the UnTab interface. These themes can be accessed by the 'themes' plugin which can be accessed by typing `/themes` in UnTab interface.

- **Content scripts:** Content scripts get injected into every webpage automatically by the browser. These scripts are helpful in performing some DOM operations on the content of the page, or in case of UnTab - showing the UnTab interface. [Read more](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Content_scripts)

- **Background scripts:** Background scripts run independent to the webpages and browser windows. It is therefore a perfect place to maintain state that must be synced with content scripts(which are in context of a webpage). Background scripts have special browser APIs available that UnTab plugins make use of to provide additional functionalities. [Read more](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Background_scripts)

## Contributing to Code

### Pre-requisites:
- Recent version of Node.js
- Recent version of npm

The UnTab project uses following languages, tools and libraries:
- JavaScript for plugins, background script, etc.
- CSS for styling and theming
- [Svelte](https://svelte.dev) for UnTab interface
- [Fuse.js library](http://fusejs.io/) to perform fuzzy searching
- [Rollup](https://rollupjs.org/guide/en/) for build and bundling

It is recommended to go through the documentation of above tools based on which part of UnTab project you are contributing to.

Let's set up the codebase on the local system.

### Fork the repository
Create a fork of this repository into your GitHub account before writing some code. Click on the `Fork` button in the repository homepage - https://github.com/blenderskool/untab

### Clone the repository
After forking, clone the forked repository by following these commands:
```bash
git clone https://github.com/<your-github-username>/untab.git
cd untab
git remote add upstream https://github.com/blenderskool/untab.git
```

### Install the dependencies
Make sure you have Node.js and npm installed for this step. Run the following command in the project root
```bash
npm install
```

### Create a new branch and write some code!
Now create a separate branch(with a cool name!) where you can work on the codebase.

```bash
git checkout -b <your-branch-name>
```
This is the right time to start working on the codebase. You will need to run the project frequently to test your changes. So let's install the development version of the extension on your browser.

### Installing Dev extension on your browser

#### Chrome and other Chromium based browsers
Let's first build the extension from the source code. To build the extension, run the following command at the project root:
```bash
npm run build
```

A `dist` folder should be created which contains the built code. This is what we'll be installing in the browser in the further steps.

- Go to `chrome://extensions`.
- Turn ON `Developer mode`.
- Click on `Load Unpacked`.
- Select the `manifest.json` file in `dist` folder that was generated after the build step. The extension should now show up on the list.
- Go to any page and press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Space</kbd> or <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>Space</kbd> (on Mac) to open UnTab.

#### Firefox
Let's first build the extension from the source code. To build the extension, run the following command at the project root:
```bash
npm run build-firefox
```

A `dist` folder should be created which contains the built code. This is what we'll be installing in the browser in the further steps.

- Go to `about:debugging` and select `This Firefox` on the left sidebar.
- Click on `Load Temporary Add-on...` button.
- Select the `manifest.json` file in `dist` folder that was generated after the build step. The extension should now show up on the list.
- Go to any page and press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Space</kbd> or <kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>Space</kbd> (on Mac) to open UnTab.

**NOTE for all browsers:** Whenever you change the source code, run `npm run build` again and get the changes synced with the installed extension by clicking on the reload icon or `Reload` button next to the installed extension in the extensions page.

### Preparing the commit
Once you are ready to commit your changes, it is important to keep the following in mind:
- While we don't follow any commit guidelines right now, it is **strongly recommended** that you follow https://chris.beams.io/posts/git-commit/#seven-rules as much as possible.
- Always remember to **test your changes manually** before committing the code. This can help you prevent stray commits(which fix bugs in your recent commits).

Here's how you would commit some changes:
```bash
git add .
git commit
```

### Sync your changes with the upstream
The upstream repository may get updated multiple times while you were working on your branch. It is important to sync your changes once before creating a Pull request to avoid merge conflicts. Follow the commands:

```bash
git pull upstream master --rebase
```

### Preparing the Pull Request
Congratulations :tada:! You have followed through multiple sections to reach this final step. At this step, make sure you have synced your changes with upstream as explained in previous step.

Now we can push the branch to the remote repository by running
```bash
git push --set-upstream origin <your-branch-name>
```

Navigate to UnTab repository [Pull requests](https://github.com/blenderskool/untab/pulls) page and follow the steps:
- Click on the green `New pull request` button
- Select the branch you want to **merge from** in the menu that says **compare: ...**
- Make sure the **base:** is set to `master`.
- Click on `Create pull request` button.
- Give your Pull request a **title summarizing your changes in the branch**. Write a good description describing the changes.
- **Important:** Make sure to add `Fixes #<issue-id>` if your pull request fixes some already open issue.

## Contributing a Plugin
Plugins are independent modules of code that expand the existing functionality of UnTab. These plugins are located in the `src/background/plugins.js` file.

- Start by following the steps in **Contributing to Code** above to setup the repository on your local machine.
- Add the code for your new plugin in the `src/background/plugins.js` file. (Link to Plugins API wiki coming soon!)
- Once you have added the plugin and tested it, commit your changes and open a Pull request (Follow the steps in **Contributing to Code** above).


## Contributing a Theme
Theme gives a unique look to UnTab. There are themes present in the extension already that can be accessed by typing `/themes` in the search bar of UnTab interface. To add your own theme:

- Start by thinking of some nice name and emoji for your theme.
- Follow the steps in **Contributing to Code** above to setup the repository on your local machine.
- Open the `src/themes/themes.css` file and define your theme. You can take inspiration from existing themes to understand which values to change. Example:
```css
.search-wrapper.theme-<your-theme-name> {
    --bg: #304140;
    --bg-80: rgba(48, 65, 64, 0.8);
    --white: #b4c7c6;
    ...
}
```
- Once the theme styles are defined, add the entry of your theme in `src/background/plugins.js` under the `themes` plugin. Example:
```js
{
'themes': {
    ...
    item: [
        ...
        {
            title: 'My amazing theme',
            url: '',
            emoji: '🌒',
            // Important: the value below should match the name defined in CSS
            theme: 'your-theme-name',
        },
    ...
}
```
- Build and test your theme (Follow the steps in **Contributing to Code** above)
- Once you are happy with the theme, commit your changes and open a pull request to this repository (Follow the steps in **Contributing to Code** above)