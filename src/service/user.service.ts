import {DocumentDefinition} from 'mongoose'
import User, { UserDocument } from '../models/user.model';

export async function createUser (input: DocumentDefinition<UserDocument>) {
    try {
        return await User.create(input)
    } catch (err: any) {
        throw new Error(err)
    }
}