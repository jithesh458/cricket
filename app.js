const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const app = express()
app.use(express.json())

let db = null
const dbPath = path.join(__dirname, 'cricketTeam.db')
const dbandserver = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server running')
    })
  } catch (e) {
    console.log(`Db:error{e.message}`)
    process.exit(1)
  }
}
dbandserver()
const convert = dbobject => {
  return {
    playerId: dbobject.player_id,
    playerName: dbobject.player_name,
    jerseyNumber: dbobject.jersey_number,
    role: dbobject.role,
  }
}

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      cricket_team;`
  const playersArray = await db.all(getPlayersQuery)

  response.send(playersArray.map(eachArray => convert(eachArray)))
  console.log(playersArray)
})

app.post('/players/', async (request, response) => {
  const getPlayersQuery = `
  SELECT *
  FROM 
  cricket_team;`
  const playerv = await db.get(getPlayersQuery)

  response.send('Player Added to Team')
})
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  console.log(playerId)
  const othersv = `
  SELECT * FROM cricket_team WHERE player_id=${playerId};
  `
  console.log(othersv)
  const bn = await db.get(othersv)
  console.log(bn)
  response.send(convert(bn))
})
app.put('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const update = `
    UPDATE cricket_team
    SET 
    player_name='${playerName}',
    jersey_number=${jerseyNumber},
    role='{role}'
    WHERE player_id=${playerId};
  `
  const ot = await db.run(update)
  response.send('Player Details Updated')
})
app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const delet = `
    DELETE FROM cricket_team
     WHERE player_id=${playerId};`

  const vb = await db.run(delet)
  response.send('Player Removed')
})
module.exports = app
