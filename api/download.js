import marked from 'marked';

module.exports = (req, res) => {
  const markdown = req.body;
  const html = marked(markdown)
  res.status(200).send(html);
};
