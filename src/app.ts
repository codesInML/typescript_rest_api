import express from 'express'
import config from 'config'
import connect from './utils/connect'
import log from './utils/logger'
import routes from './routes'
import deserializeUser from './middleware/deserializeUser'

const PORT = config.get<number>("port")

const app = express()

app.use(express.json())

app.use(deserializeUser)

app.listen(PORT, async () => {
    log.info(`App is running on http://localhost:${PORT}`)

    await connect()

    routes(app)
})