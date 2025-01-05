import Dexie from 'dexie'
const db = new Dexie('chaotica')

db.version(1).stores({
  pages: 'id'
})

export default db
