import { Role } from "./role"

export default interface User 
{
    "id": string | undefined,
    "username": string,
    "email": string,
    "firstName": string,
    "lastName": string,
    "role": Role,
    "password": string,
    "lastActivity": Date,
}