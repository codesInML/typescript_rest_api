import {Request, Response} from 'express'
import { createUser } from '../service/user.service'
import log from '../utils/logger'

export async function createUserHandler(req: Request, res: Response) {
    try{
        const user = await createUser(req.body)
        res.status(200).json({msg: "success", user})
    } catch (err: any) {
        log.error(err)
        return res.status(409).send(err.message)
    }
}