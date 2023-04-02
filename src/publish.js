import fs from 'fs';
import path from 'path';
import { getPaths } from './utils';

export const copyRecursive = (destinationPath) => {
    const { rootPath, templatePath } = getPaths();
    const hasDestinationPath = typeof destinationPath === 'string';

    destinationPath = path.join(rootPath, hasDestinationPath ? destinationPath : 'templates');

    fs.mkdirSync(destinationPath, {recursive: true});
    fs.readdirSync(templatePath).forEach(element => {
        if (fs.lstatSync(path.join(templatePath, element)).isFile()) {
            fs.copyFileSync(path.join(templatePath, element), path.join(destinationPath, element));
        } else {
            copyRecursive(path.join(templatePath, element), path.join(destinationPath, element));
        }
    });

    return destinationPath;
}