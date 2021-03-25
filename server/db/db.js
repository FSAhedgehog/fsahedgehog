const Sequelize = require('sequelize')
const pkg = require('../../package.json')

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

let config

// if (process.env.DATABASE_URL) {
//   config = {
//     logging: false,
//     ssl: true,
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//   }
// } else {
//   config = {
//     logging: false,
//   }
// }

if (process.env.DATABASE_URL) {
  config = {
    logging: false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      useUTC: true,
      // dateStrings: true,
      // typeCast: function (field, next) {
      //   // for reading from database
      //   if (field.type === 'DATE') {
      //     return field.string()
      //   }
      //   return next()
      // },
    },
    timezone: '-04:00',
  }
} else {
  config = {
    logging: false,
  }
}

// dateStrings: true,
//       typeCast: function (field, next) { // for reading from database
//         if (field.type === 'DATETIME') {
//           return field.string()
//         }
//           return next()
//         },

//   useUTC: false,
// },
// timezone: '-4:00',
const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  config
)

module.exports = db

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close())
}
