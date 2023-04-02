#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import { parser } from './args';
import { copyRecursive } from './publish';
import { TEMPLATE_TO_EXTENSION_MAPPING } from './config';
import { getMappings, getPaths, getTemplates, replacePlaceholders } from './utils';

(() => {
    const paths = getPaths();
    const args = parser(process.argv.slice(2));

    if (args.publish){
        const publishedTo = copyRecursive(args.publish);
        console.log(`\x1b[94m Published Templates to ${publishedTo} \x1b[0m`);
        return;
    }

    const componentName = args.componentName;

    if (!componentName){
        console.error('\x1b[91m ERROR: No component name provided! \x1b[0m');
        console.log(' Usage:');
        console.log('      generate <component_name>');
        return 1;
    }


    console.log('\x1b[94m Reading Templates ... \x1b[0m');
    let templates;
    try {
        templates = getTemplates(paths.templatePath);
    } catch (e){
        console.error('\x1b[91m ERROR: Cannot read templates! \x1b[0m');
        console.error(`\x1b[91m ${e.message}\x1b[0m`);
        return 1;
    }

    const mappings = getMappings(componentName);

    const outputDirectory = path.join(paths.outputPath, mappings['{COMPONENT_NAME}']);

    console.log('\x1b[94m Creating Directory ... \x1b[0m');
    if (fs.existsSync(outputDirectory)){
        console.error('\x1b[91m ERROR: Output Directory already exists! \x1b[0m');
        return 1;
    }

    try {
        fs.mkdirSync(outputDirectory, {recursive: true});
    } catch (e){
        console.error('\x1b[91m ERROR: Cannot create output directory! \x1b[0m');
        console.error(`\x1b[91m ${e.message}\x1b[0m`);
        return 1;
    }

    Object.entries(templates).forEach(([name, template]) => {
        console.log(`\x1b[94m Generating ${name} file ... \x1b[0m`);

        const output = replacePlaceholders(template, mappings);
        const outFileName = path.join(outputDirectory, (name === 'index' ? 'index' : mappings['{COMPONENT_NAME}']) + '.' + TEMPLATE_TO_EXTENSION_MAPPING[name]);

        fs.writeFileSync(outFileName, output);
    });
})();