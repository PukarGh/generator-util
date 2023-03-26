import fs from 'fs';
import path from 'path';

const TEMPLATE_TO_EXTENSION_MAPPING = {
    'index': 'ts',
    'component': 'tsx',
    'story': 'stories.tsx',
    'style-types': 'module.css.d.ts',
    'styles': 'module.css',
    'test': 'test.tsx'
};
const DEFAULT_CONFIG = {
    outputPath: 'src/components',
    templatePath: 'src/templates'
}

const getPaths = () => {
    const rootPath = process.cwd();
    let userConfig = {};

    const userConfigPath = path.join(rootPath, 'generator.config.json');
    if (fs.existsSync(userConfigPath)) {
        userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'));
    }

    const config = { ...DEFAULT_CONFIG, ...userConfig };

    Object.entries(config).forEach(([key, value]) => {
       config[key] = path.join(rootPath, `${value}`);
    });

    return { ...config, rootPath };
}

const toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1));

const getTemplates = templatePath => {
    let templates = {};

    Object.entries(TEMPLATE_TO_EXTENSION_MAPPING).forEach(([inputFile]) => {
        templates[inputFile] = fs.readFileSync(path.join(templatePath, `${inputFile}.template`), 'utf-8');
    });

    return templates;
};

const getMappings = componentName => {
    let name = toTitleCase(componentName).replace(/[^a-z0-9]/gi, '');

    return {
        '{COMPONENT_NAME}': name,
        '{COMPONENT_NAME_CAMELCASE}': name.charAt(0).toLowerCase() + name.substring(1),
    };
};

const replacePlaceholders = (template, mappings) => {
    const regex = new RegExp(Object.keys(mappings).join('|'),'gi');
    return template.replace(regex, matched => mappings[matched]);
}

(() => {
    const paths = getPaths();
    const componentName = process.argv[2];

    if (!componentName){
        console.error('\x1b[91m ERROR: No component name provided! \x1b[0m');
        console.log(' Usage:');
        console.log('      generate <component_name>');
        return 1;
    }


    let templates;
    console.log('\x1b[94m Reading Templates ... \x1b[0m');
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