export default {
  displayName: 'Start new',
  keys: ['n', 'new', '.new', 's', 'shortcut'],
  item: [
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
      favicon: 'https://icons.duckduckgo.com/ip3/calendar.google.com.ico',
      category: 'Google Apps',
    },
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
      title: 'Blaze - Start a new file sharing room',
      url: 'https://blaze.now.sh/app/instant/join' ,
      favicon: 'https://icons.duckduckgo.com/ip3/blaze.vercel.app.ico',
      category: 'Creative apps',
    }
  ],
  async handler(item) {
    await browser.tabs.create({active: true, url: item.url});
  }
};
