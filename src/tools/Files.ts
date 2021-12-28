import * as fs from 'fs';
import * as path from 'path';
import { getType } from 'mime';

export interface Stats {
    files: Array<string>,
    sizes: Array<number>,
    types: Array<string>,
    medias: Array<boolean>
}

export async function getDirSize(dirPath: string): Promise<number> {
    let totalSize = 0;
    const files = await fs.readdirSync(dirPath);
    for(let i = 0; i < files.length; i++) {
        const file = files[i];
        const src = path.join(dirPath, file);
        const stats = await fs.statSync(src);
        if(stats.isDirectory()){
            totalSize += await getDirSize(path.join(dirPath, file));
        } else {
            totalSize += stats.size;
        }
    }
    return totalSize;
}

export async function getFiles(src: string): Promise<Stats> {
    const files = await fs.readdirSync(src);const sizes = [];
    const types = new Array<string>();
    const medias = new Array<boolean>();
    for (let i in files) {
        const file = `${src}/${files[i]}`;
        const stats = await fs.statSync(file);
        let size = 0;
        if(stats.isDirectory()) {
            size = await getDirSize(file);
            types.push('Directory');
            medias.push(false);
        } else {
            size = stats.size;
            let type = getType(file);
            if (type === null) {
                type = 'File';
                medias.push(false);
            } else {
                if (type.indexOf('video') !== -1) {
                    medias.push(true);
                }
            }
            types.push(type);
        }
        size = Math.round((size / 1000000) * 100) / 100; //conversion en mo
        sizes.push(size);
    }

    return {
        files,
        sizes,
        types,
        medias
    }
}

export function getMimeType(file: string) {
    return getType(file);
}