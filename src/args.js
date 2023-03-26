export const parser = args => {
    let argList = {
        'componentName' : args[0]
    };

    let i;
    for (i = 1; i < args.length; i++){
        const currentArg = args[i];

        if (!currentArg.startsWith('--')) continue;

        let argName, argValue;
        if (currentArg.includes('=')){
            [argName, argValue] = currentArg.split('=');
        } else {
            argName = currentArg;
            if (args[i + 1].startsWith('--')){
                argValue = true;
            } else {
                argValue = args[++i];
            }
        }

        argList[argName.slice(2)] = argValue;
    }

    return argList;
}