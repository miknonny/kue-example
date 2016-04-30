const Mailgun = require('mailgun-js')
const Parse = require('parse/node')


Parse.initialize('pictraffiq')
Parse.serverURL = 'http://localhost:1337/parse/'

const mailgunAPI = {
  domain: process.env.MAILGUN_DOMAIN || 'pictraffiq.com',
  apiKey: process.env.MAILGUN_API_KEY || 'key-5964139b9799faab1bf0ae17ba821f09'
}

const mailgun = new Mailgun(mailgunAPI)

const mailData = {
  from: 'cams@pictraffiq.com',
  to: process.env.EMAIL || 'miknonny@gmail.com',
  subject: 'Fix offline cams',
  text: ''
}

// one Minute
const minute = 60000
const thirtyMinutes = minute * 30
thirtyMinutesAgo = new Date(new Date() - thirtyMinutes)

// Retrieve all cams that last connected last more than 30mins
// ago form parse. Call json.stringify on the data
// send the data as mail.
module.exports = () => {
  // return a new promise and call then on the result.
  const query = new Parse.Query('Cams')
  query.lessThan('updatedAt', thirtyMinutesAgo)
  query.limit(1000)
  query.find()
  .then(results => {
    console.log(results[0].get('camName'))
    mailData.text = JSON.stringify(results)
    // sending mail
    mailgun.messages().send(mailData, (err, body) => {
      if (err) console.log(err)
      console.log(body)
    })
  }, (err) => {
    console.log('error: ', error.code + ' ' + error.message)
  })
}
