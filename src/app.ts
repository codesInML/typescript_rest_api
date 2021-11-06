import express from 'express'
import config from 'config'
import connect from './utils/connect'

const PORT = config.get<number>("port")

const app = express()

app.listen(PORT, async () => {
    console.log(`App is running on http://localhost:${PORT}`)

    await connect()
})