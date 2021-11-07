import {Request, Response} from 'express'
import { CreateUserInput } from '../schema/user.schema'
import { omit } from 'lodash'
import { createUser } from '../service/user.service'
import log from '../utils/logger' 

export async function createUserHandler(req: Request<{}, {}, CreateUserInput["body" ]>, res: Response) {
    try{
        const user = await createUser(req.body)
        res.status(200).json({msg: "success", user})
    } catch (err: any) {
        log.error(err.message)
        return res.status(409).send(err.message)
    }
}