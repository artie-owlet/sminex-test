export const clAll = [
    [42, 'A', 'test a', 1, 0],
    [49, 'A10', 'test a10', 2, 42],
    [50, 'A20', 'test a20', 2, 42],
    [71, 'A1010', 'test a1010', 3, 49],
    [72, 'A1020', 'test a1020', 3, 49],
    [73, 'A1030', 'test a1030', 3, 49],
    [74, 'A2010', 'test a2010', 3, 50],
    [75, 'A2020', 'test a2020', 3, 50],
    [43, 'B', 'test b', 1, 0],
    [51, 'B10', 'test b10', 2, 43],
    [52, 'B20', 'test b20', 2, 43],
    [53, 'B30', 'test b30', 2, 43],
    [76, 'B1010', 'test b1010', 3, 51],
    [77, 'B1020', 'test b1020', 3, 51],
    [78, 'B2010', 'test b2010', 3, 52],
    [79, 'B2020', 'test b2020', 3, 52],
    [80, 'B2030', 'test b2030', 3, 52],
    [81, 'B3010', 'test b3010', 3, 53],
    [82, 'B3020', 'test b3020', 3, 53],
] as [number, string, string, number, number][];

export const clByCode = [
    [49, 'A10', 'test a10', 2, 42],
    [71, 'A1010', 'test a1010', 3, 49],
    [72, 'A1020', 'test a1020', 3, 49],
    [73, 'A1030', 'test a1030', 3, 49],
] as [number, string, string, number, number][];

export type ResultItemType = [string, string, number, string[]];

export const resultAll = [
    ['A', 'test a', 1, ['A']],
    ['A10', 'test a10', 2, ['A', 'A10']],
    ['A20', 'test a20', 2, ['A', 'A20']],
    ['A1010', 'test a1010', 3, ['A', 'A10', 'A1010']],
    ['A1020', 'test a1020', 3, ['A', 'A10', 'A1020']],
    ['A1030', 'test a1030', 3, ['A', 'A10', 'A1030']],
    ['A2010', 'test a2010', 3, ['A', 'A20', 'A2010']],
    ['A2020', 'test a2020', 3, ['A', 'A20', 'A2020']],
    ['B', 'test b', 1, ['B']],
    ['B10', 'test b10', 2, ['B', 'B10']],
    ['B20', 'test b20', 2, ['B', 'B20']],
    ['B30', 'test b30', 2, ['B', 'B30']],
    ['B1010', 'test b1010', 3, ['B', 'B10', 'B1010']],
    ['B1020', 'test b1020', 3, ['B', 'B10', 'B1020']],
    ['B2010', 'test b2010', 3, ['B', 'B20', 'B2010']],
    ['B2020', 'test b2020', 3, ['B', 'B20', 'B2020']],
    ['B2030', 'test b2030', 3, ['B', 'B20', 'B2030']],
    ['B3010', 'test b3010', 3, ['B', 'B30', 'B3010']],
    ['B3020', 'test b3020', 3, ['B', 'B30', 'B3020']],
] as ResultItemType[];

export const resultByCode = [
    ['A10', 'test a10', 2, ['A10']],
    ['A1010', 'test a1010', 3, ['A10', 'A1010']],
    ['A1020', 'test a1020', 3, ['A10', 'A1020']],
    ['A1030', 'test a1030', 3, ['A10', 'A1030']],
] as ResultItemType[];
