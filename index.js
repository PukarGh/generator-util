const fs = require('fs');
const path = require('path');

const PROJECT_PATH = '';
const TEMPLATES_PATH = path.join(__dirname, 'templates');
const OUTPUT_PATH = path.join('src', 'components');
const TEMPLATE_TO_EXTENSION_MAPPING = {
    'index': 'ts',
    'component': 'tsx',
    'story': 'stories.tsx',
    'style-types': 'module.css.d.ts',
    'styles': 'module.css',
    'test': 'test.tsx'
};

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
    let [componentName, projectPath] = process.argv.slice(2);
    if (PROJECT_PATH){
        projectPath = PROJECT_PATH;
    }

    if (!projectPath){
        console.error('\x1b[91m ERROR: No project path provided! \x1b[0m');
        console.log(' Usage:');
        console.log('      node generate.js <component_name> [project_path]');
        return 1;
    }

    if (!componentName){
        console.error('\x1b[91m ERROR: No component name provided! \x1b[0m');
        console.log(' Usage:');
        console.log('      node generate.js <component_name>  [project_path]');
        return 1;
    }


    console.log('\x1b[94m Reading Templates ... \x1b[0m');
    let templates;
    try {
        templates = getTemplates(TEMPLATES_PATH);
    } catch (e){
        console.error('\x1b[91m ERROR: Cannot read templates! \x1b[0m');
        console.error(`\x1b[91m ${e.message}\x1b[0m`);
        return 1;
    }

    const mappings = getMappings(componentName);

    const directory = path.join(projectPath, OUTPUT_PATH, mappings['{COMPONENT_NAME}']);

    console.log('\x1b[94m Creating Directory ... \x1b[0m');
    if (fs.existsSync(directory)){
        console.error('\x1b[91m ERROR: Write Directory already exists! \x1b[0m');
        return 1;
    }

    try {
        fs.mkdirSync(directory);
    } catch (e){
        console.error('\x1b[91m ERROR: Cannot create output directory! \x1b[0m');
        console.error(`\x1b[91m ${e.message}\x1b[0m`);
        return 1;
    }

    Object.entries(templates).forEach(([name, template]) => {
        console.log(`\x1b[94m Generating ${name} file ... \x1b[0m`);

        const output = replacePlaceholders(template, mappings);
        const outFileName = path.join(directory, (name === 'index' ? 'index' : mappings['{COMPONENT_NAME}']) + '.' + TEMPLATE_TO_EXTENSION_MAPPING[name]);

        fs.writeFileSync(outFileName, output);
    });
})();