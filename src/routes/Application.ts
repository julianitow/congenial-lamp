import * as fs from 'fs';
import twig from 'twig';
import path from 'path';
import { Response, Request } from 'express';
import { Files } from '../tools';

export class Application {

    src = '/mnt/sdb/ftp';

    constructor() {
    }

    homeRoute(req: Request, res: Response): void {
        Files.getFiles(this.src).then(stats => {
            res.render(path.join(__dirname, '../../public/view/index.twig'), stats);
        });
    }

    downloadRoute(req: Request, res: Response): void {
        const now = new Date().toLocaleString();
        if(req.query.file) {
            const file = `${this.src}/${req.query.file}`;
            res.download(file);
            console.log(`${now}: downloading ${file}`);
        } else {
            res.status(404).send('File not found');
        }
    }

    streamRoute(req: Request, res: Response): void {
        const path = `${this.src}/${req.query.file}`;
        const fileType = Files.getMimeType(path)
        const stat = fs.statSync(path);
        const fileSize = stat.size;
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1] 
            ? parseInt(parts[1], 10)
            : fileSize-1
            const chunksize = (end-start)+1
            const file = fs.createReadStream(path, {start, end})
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            fs.createReadStream(path).pipe(res)
        }
    }
}