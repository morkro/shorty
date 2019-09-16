import nanoid  from 'nanoid'
import emoji  from 'node-emoji'

export const checkEmojiID = (db, code) =>
  db.collection('shortenedURLs').findOne({ emojiID: code })

export const shortenURL = (db, url) => db
  .collection('shortenedURLs')
  .findOneAndUpdate({ originalURL: url }, {
    $setOnInsert: {
      originalURL: url,
      emojiID: nanoid(10)
        .split('')
        .map(() => emoji.random().emoji)
        .join('')
    }
  }, {
    returnOriginal: false,
    upsert: true
  })