const admin = require("firebase-admin");
const db = admin.database();
const currentYear = (new Date()).getFullYear();
const mainRef = db.ref(`${currentYear}`);

const stripGoogleSizeMarker = (string) =>
  string.includes('googleusercontent')
    ? string.replace(/=.*$/, '')
    : string;

const create = (req, res, next) => {

  const endDate = req.body.endDate;
  const startDate = req.body.startDate;
  const dbPhotos = req.body.photos &&
    req.body.photos.map((photo, id) =>
      Object.assign({}, {
        id,
        src: stripGoogleSizeMarker(photo.src),
        caption: photo.caption,
        author: photo.author,
      })
    );
  if (!(dbPhotos && dbPhotos.length > 0 && endDate && startDate)) {
    res.status(400).send();
    return;
  }
  const deleteUpdates = {
    photos: null,
    voters: null,
  }
  mainRef.update(deleteUpdates)
    .then(() => {
      const newUpdates = {
        endDate,
        startDate,
      };
      dbPhotos.forEach(photo => {
        newUpdates[`photos/${photo.id}`] = photo;
      });
      return mainRef.update(newUpdates);
    })
    .then(response => res.status(200).send())
    .catch(e => {
      console.log(e);
      res.status(422).send()
    });
};

module.exports = {
  create
};
