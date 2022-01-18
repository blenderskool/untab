export default {
  displayName: 'Shortcuts',
  keys: ['n', 'new', '.new', 's', 'shortcut'],
  item: [
    // Google apps
    {
      title: 'Google Docs - Create a new document',
      url: 'https://docs.new',
      favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png',
      category: 'Google Apps',
    },
    {
      title: 'Google Sheets - Create a new spreadsheet',
      url: 'https://sheets.new',
      favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png',
      category: 'Google Apps',
    },
    {
      title: 'Google Slides - Create a new presentation',
      url: 'https://slides.new',
      favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_presentation_x16.png',
      category: 'Google Apps',
    },
    {
      title: 'Google Forms - Create a new form',
      url: 'https://form.new',
      favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_2_form_x16.png',
      category: 'Google Apps',
    },
    {
      title: 'Google Meet - Start a new meeting',
      url: 'https://meet.new',
      favicon: 'https://icons.duckduckgo.com/ip3/meet.google.com.ico',
      category: 'Google Apps',
    },
    {
      title: 'Google Calendar - Create and send a new calendar invite',
      url: 'https://cal.new',
      emoji: '📅',
      category: 'Google Apps',
    },
    {
      title: 'Google Keep - Create a new note',
      url: 'https://note.new',
      emoji: '🗒️',
      category: 'Google Apps',
    },

    // Developer tools
    {
      title: 'CodePen - Create a new pen',
      url: 'https://pen.new',
      favicon: 'https://codepen.io/favicon.ico',
      category: 'Developer Tools',
    },
    {
      title: 'GitHub - Create a new gist',
      url: 'https://gist.new',
      favicon: 'https://github.com/favicon.ico',
      category: 'Developer Tools',
    },
    {
      title: 'GitHub - Create a new repository',
      url: 'https://github.new',
      favicon: 'https://github.com/favicon.ico',
      category: 'Developer Tools',
    },
    {
      title: 'Glitch - Create a new app',
      url: 'https://glitch.new',
      favicon: 'https://glitch.com/favicon.ico',
      category: 'Developer Tools',
    },
    {
      title: 'CodeSandbox - Create a new sandbox',
      url: 'https://csb.new',
      favicon: 'https://codesandbox.io/favicon.ico',
      category: 'Developer Tools',
    },
    {
      title: 'VSCode - Start a new VSCode web session',
      url: 'https://vscode.dev',
      favicon: 'https://vscode.dev/static/stable/favicon.ico',
      category: 'Developer Tools',
    },

    // Creative apps
    {
      title: 'Medium - Create a new story',
      url: 'https://story.new',
      favicon: 'https://icons.duckduckgo.com/ip3/medium.com.ico',
      category: 'Creative apps',
    },
    {
      title: 'Notion - Create a new page',
      url: 'https://notion.new' ,
      favicon: 'https://icons.duckduckgo.com/ip3/notion.so.ico',
      category: 'Creative apps',
    },
    {
      title: 'Photopea - Edit an image',
      url: 'https://photopea.com' ,
      favicon: 'https://icons.duckduckgo.com/ip3/photopea.com.ico',
      category: 'Creative apps',
    },
    {
      title: 'Figma - Create a new Figma file',
      url: 'https://figma.new' ,
      favicon: 'https://icons.duckduckgo.com/ip3/figma.com.ico',
      category: 'Creative apps',
    },
    {
      title: 'Figma - Create a new FigJam file',
      url: 'https://figjam.new' ,
      favicon: 'https://icons.duckduckgo.com/ip3/figma.com.ico',
      category: 'Creative apps',
    },
    {
      title: 'Canva - Create a new design',
      url: 'https://design.new' ,
      favicon: 'https://icons.duckduckgo.com/ip3/canva.com.ico',
      category: 'Creative apps',
    },
    {
      title: 'Blaze - Start a new file sharing room',
      url: 'https://blaze.now.sh/app/instant/join' ,
      favicon: 'https://icons.duckduckgo.com/ip3/blaze.vercel.app.ico',
      category: 'Creative apps',
    },

    // Other
    {
      title: 'Twitter - Create a new tweet',
      url: 'https://twitter.com/intent/tweet',
      favicon: 'https://twitter.com/favicon.ico',
      category: 'Other',
    },
    {
      title: 'Asana - Add a new task',
      url: 'https://task.new',
      favicon: 'https://asana.com/favicon.ico',
      category: 'Other',
    },
    {
      title: 'Linear - Add a new issue',
      url: 'https://linear.new',
      favicon: 'https://linear.app/static/favicon.ico',
      category: 'Other',
    },
    {
      title: 'Webex - Start a Webex meeting',
      url: 'https://webex.new',
      favicon: 'https://icons.duckduckgo.com/ip3/webex.com.ico',
      category: 'Other',
    },
  ],
  async handler(item) {
    await browser.tabs.create({active: true, url: item.url});
  }
};
