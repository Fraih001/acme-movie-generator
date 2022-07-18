const Sequelize = require('Sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_movies_db');
const { UUIDV4, UUID, STRING, INTEGER, TEXT } = Sequelize;

const Movie = conn.define('movies', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  rating: {
    type: INTEGER,
    defaultValue: 1
  }
});

const syncAndSeed = async()=>{
  await conn.sync({force:true});

  const [speed, titanic, avatar, caddyshack] = await Promise.all([
      Movie.create({ name: 'speed' }),
      Movie.create({ name: 'titanic' }),
      Movie.create({ name: 'avatar' }),
      Movie.create({ name: 'titanic' })
  ])
}

const express = require('express');
const app = express();
const path = require('path');
const { faker } = require('@faker-js/faker');


app.use(express.json())
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/movies', async(req,res,next)=>{
  try{
    const movies = await Movie.findAll();
    res.status(201).send(movies);
  } catch(er) {
    next(er)
  }
});

app.post('/api/movies', async(req,res,next)=>{
  try{
  const movie = await Movie.create({name: faker.random.words(3)});
  res.status(201).send(movie);
  } catch(er){
    next(er)
  }
});

app.delete('/api/movies/:id', async(req,res,next)=>{
  try{
    const movie = await Movie.findByPk(req.params.id);
    await movie.destroy()
    res.sendStatus(204);
  } catch(er){
    next(er);
  }
});

app.put('/api/movies/:id', async(req,res,next)=>{
  try{
    const movie = await Movie.findByPk(req.params.id);
    await movie.update(req.body);
    res.status(201).send(movie);

  }catch(er){
    next(er)
  }
})

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ err });
});



const init = async()=> {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
}

init();
