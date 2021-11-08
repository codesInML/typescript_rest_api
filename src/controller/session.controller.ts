import { Request, Response } from "express";
import { createSession, findSessions, updateSessions } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import config from 'config'
import { signJWT } from "../utils/jwt.utils";

export async function createUserSessionHandler (req: Request, res: Response) {
    // Validate the users password
    const user = await validatePassword(req.body)

    if(!user) {
        return res.status(401).json({msg: "Invalid email or password", })
    }

    // create a session
    const session = await createSession(user._id, req.get('user-agent') || "")

    // create an access token
    const accessToken = signJWT(
        { ...user, session: session._id },
        {expiresIn: config.get('accessTokenTtl')}) // 15 minutes

    // create a refresh token
    const refreshToken = signJWT(
        { ...user, session: session._id },
        {expiresIn: config.get('refreshTokenTtl')} // 1 year
    )

    // return access and refresh tokens
    res.status(200).json({accessToken, refreshToken})
}

// created the session route for send the user access and refresh token

export async function getUserSessionHandler (req: Request, res: Response) {
    const userId = res.locals.user._id

    const sessions = await findSessions({user: userId, valid: true})

    return res.status(200).json({msg: "success", sessions})
}

export async function deleteSessionHandler (req: Request, res: Response) {
    const sessionId = res.locals.user.session

    await updateSessions({_id: sessionId}, {valid: false})
    return res.status(200).json({accessToken: null, refreshToken: null})
}