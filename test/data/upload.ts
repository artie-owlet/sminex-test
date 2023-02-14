export const uploadCsv = 'Код;Описание;Уровень\r\n'
    + 'A;test a;1\r\n'
    + 'A10;test a10;2\r\n'
    + 'A20;test a20;2\r\n'
    + 'A2010;test a2010;3\r\n'
    + 'A2020;test a2020;3\r\n'
    + 'A2030;test a2020;3\r\n'
    + 'B;test b;1\r\n'
    + 'B10;test b10;2\r\n'
    + 'B20;test b20;2\r\n'
    + 'B2010;test b2010;3\r\n'
    + 'B2020;test b2020;3\r\n'
    + 'B2030;test b2020;3\r\n'
    + 'ZZZ;test zzz;1';

export const uploadSql = [
    ['query', 'START TRANSACTION'],
    ['query', 'INSERT', ['A', 'test a', 1, 0]], // 1
    ['query', 'INSERT', ['B', 'test b', 1, 0]], // 2
    ['query', 'INSERT', ['ZZZ', 'test zzz', 1, 0]], // 3
    ['query', 'INSERT', ['A10', 'test a10', 2, 1]], // 4
    ['query', 'INSERT', ['A20', 'test a20', 2, 1]], // 5
    ['query', 'INSERT', ['B10', 'test b10', 2, 2]], // 6
    ['query', 'INSERT', ['B20', 'test b20', 2, 2]], // 7
    ['query', 'INSERT', ['A2010', 'test a2010', 3, 5]], // 8
    ['query', 'INSERT', ['A2020', 'test a2020', 3, 5]], // 9
    ['query', 'INSERT', ['A2030', 'test a2020', 3, 5]], // 10
    ['query', 'INSERT', ['B2010', 'test b2010', 3, 7]], // 11
    ['query', 'INSERT', ['B2020', 'test b2020', 3, 7]], // 12
    ['query', 'INSERT', ['B2030', 'test b2020', 3, 7]], // 13
    ['query', 'COMMIT'],
];

export const uploadCsvErr = [
    'Код;Описание;Уровень\r\n'
    + 'A;test a;1\r\n'
    + 'A10;test a10;3\r\n',
    
    'Код;Описание;Уровень\r\n'
    + 'A;test a;1\r\n'
    + 'A10;test a10;\r\n',
    
    'Код;Описание\r\n'
    + 'A;test a\r\n'
    + 'A10;test a10\r\n',
];
