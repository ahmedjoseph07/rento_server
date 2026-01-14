import app from "./app.js"
import config from "./config/index.js"
import "./cronjobs/autoReturn.js"

const port = config.port

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})