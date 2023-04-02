import fs from 'fs';
import path from 'path';

export const publishTemplates = (options) => {
    const { rootPath, templatePath, publish } = options;
    const hasDestinationPath = typeof publish === 'string';

    const destinationPath = path.join(rootPath, hasDestinationPath ? publish : 'templates');

    fs.mkdirSync(destinationPath, {recursive: true});
    fs.readdirSync(templatePath).forEach(element => {
        if (fs.lstatSync(path.join(templatePath, element)).isFile()) {
            fs.copyFileSync(path.join(templatePath, element), path.join(destinationPath, element));
        } else {
            publishTemplates(path.join(templatePath, element), path.join(destinationPath, element));
        }
    });

    return destinationPath;
}