const bcrypt = require('bcrypt');
const db = require("../database");
const { QueryTypes } = require("sequelize");
const jwt = require('jsonwebtoken');

// TODO: en otro controller login-controller tener un método que haga login
// parte de ese código es común a este otro método (generar el token y devolverlo), pero además también
// tiene que validar la pass

async function login(req, res) {
  // TODO ver si conviene recibirlo por header
  const {username, password} = req.body;

  // consultar la base y obtener el usuario y contraseña
  // validar la pass vs la almacenada
  // si todo va bien, continuar, si no retornar un 401
  const user = findUserByUsername(username);
  const valid = await bcrypt.compare(password, user.password_hash);

  if (valid) {
    const user_id = user.id;
    const token = jwt.sign({user_id}, process.env.ACCESS_TOKEN_SECRET);
    res.json({token});
  } else {
    res.status(401).end();
  }
}

async function findUserByUsername(username) {
  const users = await db.query(`select * from users where username = :username`, {
      replacements: { username },
      type: QueryTypes.SELECT
  });

  if (users.length === 0) {
      throw new Error('No existe el usuario');
  }

  return users[0];
}

module.exports = {
  login
};
