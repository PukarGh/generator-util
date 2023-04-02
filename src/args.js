export const parser = args => {
    if (!args[0].startsWith('--')){
        args[0] = `--componentName=${args[0]}`
    }

    let argList = {};

    let i;
    for (i = 0; i < args.length; i++){
        const currentArg = args[i];

        if (!currentArg.startsWith('--')) continue;

        let argName, argValue;
        if (currentArg.includes('=')){
            [argName, argValue] = currentArg.split('=');
        } else {
            argName = currentArg;
            if (i + 1 === args.length || args[i + 1].startsWith('--')){
                argValue = true;
            } else {
                argValue = args[++i];
            }
        }

        argList[argName.slice(2)] = argValue;
    }

    return argList;
}