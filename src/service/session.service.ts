import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import Session, { SessionDocument } from "../models/session.model";
import { signJWT, verifyJWT } from "../utils/jwt.utils";
import { findUser } from "./user.service";

export async function createSession (userId: string, userAgent: string) {
    const session = await Session.create({ user: userId, userAgent})

    return session.toJSON()
}

export async function findSessions (query: FilterQuery<SessionDocument>) {
    return await Session.find(query).lean()
}

export async function updateSessions (query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
    return await Session.updateOne(query, update)
}

export async function reIssueAccessToken ({refreshToken}: {refreshToken: string;}) {
    const {decoded} = verifyJWT(refreshToken)

    if (!decoded || !get(decoded, "session")) return false

    const session = await Session.findById(get(decoded, "session"))

    if(!session || !session.valid) return false

    const user = await findUser({ _id: session.user })

    if (!user) return false

    // create an access token
    const accessToken = signJWT(
        { ...user, session: session._id },
        {expiresIn: config.get('accessTokenTtl')}) // 15 minutes


    return accessToken
}