const router = require("express").Router()
const Task = require("../model/Task")
const auth = require("../middleware/auth")


// ADD TASKS

router.post("/add", auth, async (req, res) => {

    try {

        const { title } = req.body

        const task = new Task({
            title,
            user: req.user.id
        })

        await task.save()

        res.status(201).json(task)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

})

// GET TASKS

router.get("/", auth, async (req, res) => {

    try {
        const tasks = await Task.find({
            user: req.user.id
        })

        res.json(tasks)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})


module.exports = router