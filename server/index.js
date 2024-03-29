require("mongodb")
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const axios = require("axios")

const app = express()

const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/calendar-app'

mongoose.connect(MONGO_URL).catch(error => {
  console.error(error)
})

mongoose.connection.on('error', error => {
  console.error(error)
})

const labelSchema = new mongoose.Schema({
  text: String,
  color: String,
})

const Label = mongoose.model("Label", labelSchema)

const taskSchema = new mongoose.Schema({
  title: String,
  date: String,
  labels: [labelSchema],
  index: Number,
})

const Task = mongoose.model("Task", taskSchema)

app.use(cors())

app.use(express.json())

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ index: 1 })

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/tasks", async (req, res) => {
  try {
    const { date, title, labels } = req.body

    const lastTask = await Task.findOne({ date }).sort({ index: -1 })
    const lastIndex = lastTask ? lastTask.index : 0

    const task = new Task({ date, title, labels, index: lastIndex + 1 })

    await task.save()

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { date, title, labels, index } = req.body
    const task = await Task.findByIdAndUpdate(
      id,
      { date, title, labels, index },
      { new: true }
    )

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params
    const task = await Task.findByIdAndDelete(id)

    await Task.updateMany(
      { date: task.date, index: { $gt: task.index } },
      { $inc: { index: -1 } }
    )

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get("/api/labels", async (req, res) => {
  try {
    const labels = await Label.find()

    res.json(labels)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/labels", async (req, res) => {
  try {
    const { text, color } = req.body
    const label = new Label({ text, color })

    await label.save()

    res.json(label)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put("/api/labels/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { text, color } = req.body
    const label = await Label.findByIdAndUpdate(
      id,
      { text, color },
      { new: true }
    )

    res.json(label)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.delete("/api/labels/:id", async (req, res) => {
  try {
    const { id } = req.params

    await Task.updateMany(
      { labels: { $elemMatch: { _id: id } } },
      { $pull: { labels: { _id: id } } }
    )

    const label = await Label.findByIdAndDelete(id)

    res.json(label)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get("/api/holidays/:year/:country", async (req, res) => {
  try {
    const { year, country } = req.params

    const allowedCountries = ['UA']

    if (!allowedCountries.includes(country) || /^\d{4}$/.test(year)) {
      return res.status(400).json({ error: "Unacceptable year or country code" })
    }
    const response = await axios.get(
      `https://date.nager.at/api/v2/publicholidays/${year}/${country}`
    )
    const holidays = response.data

    res.json(holidays)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/tasks/import", async (req, res) => {
  try {
    const data = req.body

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid data format" })
    }

    const safeData = data.map(({ title, date, labels, index}) => ({title, date, labels, index}))

    const result = await Task.collection.insertMany(safeData)

    res.json({ message: `Imported ${result.insertedCount} documents into Tasks` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/tasks/bulk", async (req, res) => {
  try {
    const data = req.body

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid data format" })
    }

    for (const obj of data) {
      const filter = { _id: obj._id }
      const update = { $set: {
          "title": obj.title,
          "date": obj.date,
          "labels": obj.labels,
          "index": obj.index,
        } }

      await Task.updateOne(filter, update)
    }

    res.json({ message: `OK` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/', function(req, res) {
  res.send('api server')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
  console.log(`Server connected to database`)
})

module.exports = app