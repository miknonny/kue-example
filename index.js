const kue = require('kue')

const queue = kue.createQueue({
  redis: 'redis://:showdown22@pub-redis-11790.us-east-1-1.1.ec2.garantiadata.com:11790'
})

// one minute
const minute = 60000

// Create Job function.
const createJob = () => {
    queue.create('email', {
    title: 'Account renewal required',
    to: 'miknonny@gmail.com',
    template: 'renewal-email'
  }).delay(minute)
    .priority('high')
    .attempts(5)
    .removeOnComplete(true)
    .save()
}

// Invoking the create job function.
createJob()

// Remove the job on completed and create job again.
queue.on('job complete', (id, result) => {
  createJob()
})

// queue.process will always be called to handle jobs when ever delay expires.
queue.process('email', 1, (job, done) => {
  console.log(job.data)
  setTimeout(() => {
    done()
  }, Math.random() * 10000)
})

// Starting Kue UI.
kue.app.listen(3000)
console.log('UI started on port 3000')
