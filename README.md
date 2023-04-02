## generator-util
`generator-util` is a command line tool to generate components quickly using templates.

### Installation
- Yarn
```shell
$ yarn add @pukargh/generator-util --dev
```

### Usage
The generator util can be run as follows:
```shell
$ yarn generate YourComponentName
```

This will generate all the necessary files for a component in your `src/components` directory.

### Options
The generator can be configured as needed using one of the two methods:
- Pass in the option to the generator when running:
    ```shell
    $ yarn generate YourComponentName --outputPath=src/components
    ```

- Define the options in `generator.config.json` located in the project root.
    ```json
    {
      "outputPath": "src/components"
    }
    ```

The option passed when running the command will take precedence over the ones defined in the config file.

Following are the available options:
- `optputPath`(optional): Defines the path at which the components should be created. Should be relative to the project root. Default is `src/components`.
- `templatePath`(optional): Defines the path at the template files for the component are located. Can be used if you wish to use your own templates instead of default ones. Should be relative to the project root.

If you wish to modify the templates, you can do so after publishing the templates and modifying them. To publish the template files, run the following
```shell
$ yarn generate --publish
OR
$ yarn generate --publish=mytemplates/customtemplates
```
The publish option can be left empty or a path can be provided where the template files will be published. If you provide a custom path to the publish option here, you will need to pass it to the `templatePath` option (or set it in the config json) when generating.