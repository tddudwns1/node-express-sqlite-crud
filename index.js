var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

const Comments = sequelize.define(
  'Comments',
  {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

(async () => {
  await Comments.sync();
  console.log('The table for the User model was just (re)created!');
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', async function (req, res) {
  const comments = await Comments.findAll();

  res.render('index', { comments: comments });
});

app.get('/create', function (req, res) {
  console.log(req.query);
  res.send('hi');
});

app.post('/create', async function (req, res) {
  console.log(req.body);

  const { content } = req.body;

  const jane = await Comments.create({ content: content });
  console.log("Jane's auto-generated ID:", jane.id);

  res.redirect('/');
});

app.post('/update/:id', async function (req, res) {
  console.log(req.params);
  console.log(req.body);

  const { id } = req.params;
  const { content } = req.body;

  await Comments.update(
    { content: content },
    {
      where: {
        id: id,
      },
    }
  );

  res.redirect('/');
});

app.post('/delete/:id', async function (req, res) {
  console.log(req.params);

  const { id } = req.params;

  await Comments.destroy({
    where: {
      id: id,
    },
  });

  res.redirect('/');
});

app.listen(8080);
console.log('Server is listening on port 8080');
