import { RowDataPacket } from "mysql2";
import * as Database from "../database";
import { User } from "../database";


export async function findOne(username: string): Promise<User> {
    const queryStr = `SELECT * from Users WHERE name = '${username}'`;
    const result = await Database.asyncQuery(queryStr);
    const user = (<RowDataPacket>result[0]) as User;
    return user;
} 