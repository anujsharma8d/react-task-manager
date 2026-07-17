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


// EDIT TASK

router.put("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        })

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }

        task.title = req.body.title || task.title;

        await task.save();
        res.json(task)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})


// DELETE TASK

router.delete("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        })

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }

        res.json({
            message: "Task Deleted"
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})


// TOOGLE COMPLETE

router.patch("/:id", auth, async (req, res) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        })

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }

        task.completed = !task.completed

        await task.save();
        res.json(task)

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

})


module.exports = router