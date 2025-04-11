import { Role } from "./role"

export default interface User 
{
    id: string | undefined,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    role: Role,
    password: string,
    lastActivity: Date,
    team: string | undefined
}

export interface UserDTO
{
    id: string | undefined,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    role: Role
}