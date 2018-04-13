import { squares, unitlist, units, peers } from './sudoku';

test('len squares is 81', () => {
  expect(squares.length).toBe(81);
});

test('len unitlist is 27', () => {
  expect(unitlist.length).toBe(27);
});

test('all squares have 3 units', () => {
  squares.map(s => {
    expect(units.get(s).length).toBe(3);
  });
});

test('all squares have 20 peers', () => {
  squares.map(s => {
    expect(peers.get(s).size).toBe(20);
  });
});

test('c2 units matches', () => {
  expect(units.get('C2')).toEqual([
    ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2'],
    ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
    ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'],
  ]);
});

test('c2 peers matches', () => {
  expect(peers.get('C2')).toEqual(
    new Set([
      'A2',
      'B2',
      'D2',
      'E2',
      'F2',
      'G2',
      'H2',
      'I2',
      'C1',
      'C3',
      'C4',
      'C5',
      'C6',
      'C7',
      'C8',
      'C9',
      'A1',
      'A3',
      'B1',
      'B3',
    ])
  );
});
