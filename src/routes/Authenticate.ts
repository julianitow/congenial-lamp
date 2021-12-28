import { Request, Response } from "express";
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { findOne } from "../Models/user";

export interface Auth {
    userId: number,
    token: string
}

export class Authenticate {
    req: Request;
    res: Response;
    constructor(req: Request, res: Response){
        this.res = res;
        this.req = req;
    }

    async login(): Promise<void> {
        const password = this.req.query.password as string;
        const username = this.req.query.name as string;
        const userDb = await findOne(username);
        const userId = userDb.id;
        bcrypt.compare(password, userDb.password).then(valid => {
            if(!valid) {
                this.res.redirect('/login');
                return;
            }
            const token = jwt.sign({userId: userId }, 'RANDOM_SECRET_TOKEN', { expiresIn: '24h'});
            this.res.redirect(`/?token=${token}&userId=${userId}`);
        });
    }

    loginView(): void {
        this.res.render(path.join(__dirname, '../../public/view/login.twig'));
    }
}