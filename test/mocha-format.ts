export function describeMethod(name: string, fn: (this: Mocha.Suite) => void): Mocha.Suite {
    return describe(`#${name}()`, fn);
}

export function describeStaticMethod(name: string, fn: (this: Mocha.Suite) => void): Mocha.Suite {
    return describe(`.${name}()`, fn);
}

export function describeEvent(name: string, fn: (this: Mocha.Suite) => void): Mocha.Suite {
    return describe(`#on("${name}")`, fn);
}
