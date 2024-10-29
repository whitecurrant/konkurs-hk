const admin = require('firebase-admin')
const db = admin.database()
const currentYear = new Date().getFullYear();
const mainRef = db.ref(`${currentYear}`)

const list = (req, res, next) =>
  mainRef.once('value').then(snapshot => {
    const data = snapshot.val()
    const now = new Date().getTime()
    if (now > data.startDate && now < data.endDate) {
      res.json(
        snapshot
          .val()
          .photos.filter(o => !!o)
          .map(o =>
            Object.assign(
              {},
              {
                id: o.id,
                caption: o.caption,
                author: o.author,
                src: o.src.concat('=w1920-h1080'),
                thumbnailBig: o.src.concat('=w180-h180-p'),
                thumbnail: o.src.concat('=w100-h100-p'),
              },
            ),
          ),
      )
    } else {
      const errorBody = { start: data.startDate, end: data.endDate }
      res
        .status(410)
        .send(
          now > data.startDate
            ? Object.assign(errorBody, { error: 'Głosowanie się już zakończyło :(' })
            : Object.assign(errorBody, { error: 'Głosowanie jeszcze się nie zaczęło' }),
        )
    }
  })

const listAdmin = (req, res, next) =>
  mainRef.once('value').then(snapshot => {
    const data = snapshot.val()
    res.json({
      photos: data.photos
        .filter(o => !!o)
        .map(photo =>
          Object.assign(
            {},
            {
              caption: photo.caption,
              author: photo.author,
              id: photo.id,
              score: photo.voters ? Object.keys(photo.voters).length : 0,
              src: photo.src.concat('=s0'),
            },
          ),
        )
        .sort((a, b) => b.score - a.score),
      voters: data.voters ? Object.keys(data.voters).length : 0,
    })
  })

const vote = (req, res, next) =>
  mainRef
    .once('value')
    .then(snapshot => {
      const voter = req.body.voter.toLowerCase().replace(/\W/g, '')
      const photoIds = req.body.votes
      const data = snapshot.val()
      const timestamp = new Date().getTime()
      if (timestamp > data.endDate) {
        res.status(410).send({ error: 'Głosowanie się już zakończyło :(' })
        return
      }
      if (!voter) {
        res.status(406).send({ error: 'Be serious... Tak się nazywasz? Wpisz coś normalnego.' })
        return
      }
      if (data.voters && Object.keys(data.voters).indexOf(voter) > -1) {
        res.status(406).send({ error: 'Osoba o takim nicku już głosowała' })
      } else {
        const updates = {}
        photoIds.forEach(photoId => {
          updates[`photos/${photoId}/voters/${voter}`] = timestamp
        })
        updates[`voters/${voter}`] = timestamp
        mainRef
          .update(updates)
          .then(response => {
            res.json({ message: 'ok ' })
          })
          .catch(e => {
            console.log(e)
            res.status(500).send()
          })
      }
    })
    .catch(e => {
      console.log(e)
      res.status(500).send()
    })

module.exports = {
  list,
  listAdmin,
  vote,
}
