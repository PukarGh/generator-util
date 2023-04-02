import path from 'path';
import fs from 'fs';
import {TEMPLATE_TO_EXTENSION_MAPPING} from './config';


export const getTemplates = templatePath => {
    let templates = {};

    const publishedTemplatePath = path.join(process.cwd(), 'templates')
    if (fs.existsSync(publishedTemplatePath)){
        templatePath = publishedTemplatePath;
    }

    Object.entries(TEMPLATE_TO_EXTENSION_MAPPING).forEach(([inputFile]) => {
        templates[inputFile] = fs.readFileSync(path.join(templatePath, `${inputFile}.template`), 'utf-8');
    });

    return templates;
};

export const getMappings = componentName => {
    let name = toTitleCase(componentName).replace(/[^a-z0-9]/gi, '');

    return {
        '{COMPONENT_NAME}': name,
        '{COMPONENT_NAME_CAMELCASE}': name.charAt(0).toLowerCase() + name.substring(1),
    };
};

export const replacePlaceholders = (template, mappings) => {
    const regex = new RegExp(Object.keys(mappings).join('|'),'gi');
    return template.replace(regex, matched => mappings[matched]);
}

const toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1));