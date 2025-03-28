import { Role } from "./role"

export default interface User 
{
    "_id": string,
    "username": string,
    "email": string,
    "firstName": string,
    "lastName": string
    "role": Role
    "lastActivity": Date,
}