const kue = require('kue')

const queue = kue.createQueue()

// one minute
const minute = 60000

var job
const createJob = () => {
  job = queue.create('email', {
    title: 'Account renewal required',
    to: 'miknonny@gmail.com',
    template: 'renewal-email'
  }).delay(minute)
    .priority('high')
    .save()
}

createJob()

queue.on('job complete', (id, result) => {
  createJob()
})

// queue.create('email', {
//   title: 'Account expired',
//   to: 'miknonny@gmail.com',
//   template: 'expired-email'
// }).delay(10000)
//   .priority('high')
//   .save()

// Once process to handle both email jobs.
queue.process('email', 10, (job, done) => {
  console.log(job.data)
  setTimeout(() => {
    done()
  }, Math.random() * 10000)
})

// Starting the UI.
kue.app.listen(3000)
console.log('UI started on port 3000')
