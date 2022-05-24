const { parse } = require('csv-parse')
const fs = require('fs')
console.log(parse)

const planets = require('./planets.mongo')

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  )
}

function loadPlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      '/Users/romanvinokurov/Nodejs/nasa-project/server/data/kepler_data.csv'
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          console.log(data)
          //upset = insert + update
          // planet will only be added if doesn't exist
          await savePlanet(data)
        }
      })
      .on('error', (err) => {
        console.log(err)
        reject(err)
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length
        console.log(`${countPlanetsFound} habitable planets found`)
        resolve()
      })
  })
}

async function getAllPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  )
}

async function savePlanet(data) {
  try {
    await planets.updateOne(
      {
        keplerName: data.kepler_name,
      },
      {
        keplerName: data.kepler_name,
      },
      {upsert: true}
    )
  } catch (err) {
    console.error(`Could not save a planet.`)
  }
}

module.exports = {
  loadPlanetData,
  getAllPlanets,
}
