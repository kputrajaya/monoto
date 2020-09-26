const { join } = require('path');
const chrome = require('chrome-aws-lambda');
const marked = require('marked');
const puppeteer = require('puppeteer-core');

const mdToHtml = (md) => md ? marked(md) : null;

const htmlToPdf = async (html) => {
  if (!html) return null;

  const browser = await puppeteer.launch({
    executablePath: await chrome.executablePath,
    args: chrome.args,
    headless: chrome.headless
  });
  const page = await browser.newPage();

  await page.setContent(`<div class="markdown-body">${html}</div>`);
  await page.addStyleTag({content: '@page { margin: 1cm }'});
  await page.addStyleTag({path: join(__dirname, 'github-markdown-css.css')});
  const pdf = await page.pdf({format: 'A4'});

  await browser.close();
  return pdf;
};

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  const { title, markdown } = req.body.markdown;
  const html = mdToHtml(markdown);
  const pdf = await htmlToPdf(html);

  res.setHeader('Content-Disposition', `attachment; filename=${title || 'Note'}.pdf`);
  res.send(pdf);
};
