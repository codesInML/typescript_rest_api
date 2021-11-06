import { object, string, TypeOf } from "zod"

export const createUserSchema = object({
    body: object({
        name: string({
            required_error: "Name is required"
        }),
        email: string({
            required_error: "Email is required"
        }).email("Please provide a valid email"),
        password: string({
            required_error: "Password is required"
        }).min(6, "Password too short, should be minium of 6 chars"),
        passwordConfirmation: string({
            required_error: "Name is required"
        }),
    }).refine(data => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"]
    })
})

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, "body.passwordConfirmation">