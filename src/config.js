import path from 'path';
import fs from 'fs';

export const TEMPLATE_TO_EXTENSION_MAPPING = {
    'index': 'ts',
    'component': 'tsx',
    'story': 'stories.tsx',
    'style-types': 'module.css.d.ts',
    'styles': 'module.css',
    'test': 'test.tsx'
};

/**
 * @typedef {Object} Options
 * @property {string} outputPath - The path at which the generated files will be placed.
 * @property {string} templatePath - The path from which files templates will be read.
 */

/**
 *
 * @param argsOptions
 * @returns {Options}
 */
export const getOptions = argsOptions => {
    const rootPath = process.cwd();

    const defaultOptions = getDefaultOptions();
    const userOptions = getUserOptions();

    const options = { ...defaultOptions, ...userOptions, ...argsOptions };

    Object.entries(options).forEach(([key]) => {
        if (key.includes('Path')){
            const isUserPath = key === 'outputPath' || { ...userOptions, ...argsOptions }.hasOwnProperty(key);
            options[key] = path.join(isUserPath ? rootPath : __dirname, options[key]);
        }
    });

    return { ...options, rootPath };
}

const getDefaultOptions = () => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'))
}

const getUserOptions = () => {
    const rootPath = process.cwd();
    let userConfig = {};

    const userConfigPath = path.join(rootPath, 'generator.config.json');
    if (fs.existsSync(userConfigPath)) {
        userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'));
    }

    return userConfig;
}