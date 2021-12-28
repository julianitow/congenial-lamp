import mysql from 'mysql2';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../conf/.env')});

export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
});

export function asyncQuery(sql, data = null){
    return new  Promise((resolve, reject) => {
        db.query(sql, [data], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    });
}