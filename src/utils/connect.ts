import mongoose from 'mongoose'
import config from 'config'
import log from './logger'

async function connect () {
    const dbURI = config.get<string>('dbURI')

    try {
        await mongoose.connect(dbURI)
        log.info("DB connected")
    } catch (error) {
        log.error("Could not connect to the database")
        process.exit(1)
    }
}

export default connect