const kue = require('kue')

const queue = kue.createQueue()

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
    .save()
}

// Invoking the create job function.
createJob()

// Remove the job on completed and create job again.
queue.on('job complete', (id, result) => {
  kue.Job.get(id, (err, job) => {
    if (err) return;
    job.remove(err => {
      if (err) throw err;
      console.log(`removed completed job ${job.id}`)
    })
  })
  createJob()
})

// queue.process will always be called to handle jobs.
queue.process('email', 10, (job, done) => {
  console.log(job.data)
  setTimeout(() => {
    done()
  }, Math.random() * 10000)
})

// Starting Kue UI.
kue.app.listen(3000)
console.log('UI started on port 3000')
