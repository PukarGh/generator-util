import path from 'path';
import fs from 'fs';
import {TEMPLATE_TO_EXTENSION_MAPPING, DEFAULT_CONFIG} from './config';

export const getPaths = () => {
    const rootPath = process.cwd();
    let userConfig = {};

    const userConfigPath = path.join(rootPath, 'generator.config.json');
    if (fs.existsSync(userConfigPath)) {
        userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'));
    }

    const config = { ...DEFAULT_CONFIG, ...userConfig };

    Object.entries(config).forEach(([key, value]) => {
        if (key === 'outputPath'){
            config[key] = path.join(rootPath, `${value}`);
        } else {
            config[key] = path.join(userConfig[key] ? rootPath : __dirname, `${value}`);
        }
    });

    return { ...config, rootPath };
}

export const getTemplates = templatePath => {
    let templates = {};

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