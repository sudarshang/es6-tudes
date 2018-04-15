import * as fs from 'fs';
import { center, sum, zip } from './util';

let cross = (A, B) => {
  let result = [];
  for (let a of A) {
    for (let b of B) {
      result.push(a + b);
    }
  }
  return result;
};

let subregion = (rowTriples, colTriples) => {
  let result = [];
  for (let rs of rowTriples) {
    for (let cs of colTriples) {
      result.push(cross(rs, cs));
    }
  }
  return result;
};

const digits = '123456789';
const rows = 'ABCDEFGHI';
const cols = digits;
export const squares = cross(rows, digits);
const subregion3x3 = subregion(['ABC', 'DEF', 'GHI'], ['123', '456', '789']);

export const unitlist = []
  .concat(cols.split('').map(c => cross(rows, c)))
  .concat(rows.split('').map(r => cross(r, cols)))
  .concat(subregion3x3);

export const units = new Map(
  squares.map(s => {
    let result = [];
    for (let u of unitlist) {
      if (u.includes(s)) {
        result.push(u);
      }
    }
    return [s, result];
  })
);

export const peers = new Map(squares.map(s => [s, new Set([].concat(...units.get(s)).filter(x => x != s))]));
/**
 * Assigns the digits from the input grid to the squares.
 *
 * @export
 * @param {any} grid
 * @return {Fales|Map} False if unable to assign digits to square else
 * a Map with the assignments
 */
export const parseGrid = grid => {
  let values = new Map(squares.map(s => [s, digits]));
  for (let [s, d] of gridValues(grid).entries()) {
    if (digits.includes(d) && !assign(values, s, d)) {
      return false;
    }
  }
  return values;
};
/**
 * Assigns digit 'd' to square 's'
 *
 * @export
 * @param {Map} values : Map of squares to possible digits
 * @param {String} s : Square
 * @param {String} d : Digit
 * @return {False|Map}: False if unable to assign digits to square else
 * a Map with the assignments
 */
export const assign = (values, s, d) => {
  const otherValues = values.get(s).replace(d, '');
  const result = otherValues.split('').map(d2 => eliminate(values, s, d2));
  if (result.every(r => r != false)) {
    return values;
  } else {
    return false;
  }
};

/**
 *
 *
 * @export
 * @param {Map} values : Map of squares to possible digits
 * @param {String} s : Sqaure
 * @param {String} d : Digit
 * @return {False|Map}
 */
export const eliminate = (values, s, d) => {
  // Eliminate d from values[s]; propagate when values or places <= 2.
  // Return values, except return False if a contradiction is detected.
  if (!values.get(s).includes(d)) {
    return values;
  }
  values.set(s, values.get(s).replace(d, ''));
  const sDigits = values.get(s);
  if (sDigits.length == 0) {
    return false;
  } else if (sDigits.length == 1) {
    // (1) If a square s is reduced to one value d2, then eliminate d2 from the peers.
    const d2 = sDigits;
    if ([...peers.get(s)].map(sq => eliminate(values, sq, d2)).some(r => r == false)) {
      return false;
    }
  }
  // (2) If a unit u is reduced to only one place for a value d, then put it there.
  for (let u of units.get(s)) {
    const dplaces = u.filter(sq => values.get(sq).includes(d));
    if (dplaces.length == 0) {
      return false;
    } else if (dplaces.length == 1) {
      if (!assign(values, dplaces[0], d)) {
        return false;
      }
    }
  }
  return values;
};
/**
 *
 *
 * @export
 * @param {any} grid
 * @return {Map}
 */
export function gridValues(grid) {
  const emptyChars = '0.';
  const chars = grid.split('').filter(c => digits.includes(c) || emptyChars.includes(c));
  return new Map(zip(squares, chars));
}

/**
 *
 *
 * @export
 * @param {any} values
 */
export function display(values) {
  const width = 1 + Math.max(...squares.map(s => values.get(s).length));
  const dashes = '_'.repeat(width * 3);
  const line = Array(3)
    .fill(dashes)
    .join('+');
  for (let r of rows) {
    let result = [];
    for (let c of cols) {
      result.push(center(values.get(r + c), width));
      if ('36'.includes(c)) {
        result.push('|');
      }
    }
    console.log(result.join(''));
    if ('CF'.includes(r)) {
      console.log(line);
    }
  }
}

/**
 *
 *
 * @export
 * @param {any} grid
 * @return {False|Map}
 */
export function solve(grid) {
  return search(parseGrid(grid));
}

/**
 *
 *
 * @export
 * @param {any} values
 * @return {False|Map}
 */
export function search(values) {
  if (!values) return false;

  if (squares.every(s => values.get(s).length == 1)) {
    return values;
  }
  const [, s] = squares
    .map(s => {
      const sDigits = values.get(s);
      if (sDigits.length > 1) {
        return [sDigits.length, s];
      } else return null;
    })
    .filter(mr => {
      return mr != null;
    })
    .reduce((prev, curr) => (prev[0] < curr[0] ? prev : curr));
  for (let d of values.get(s)) {
    const result = search(assign(new Map(values), s, d));
    if (result) {
      return result;
    }
  }
}

/* eslint-disable */
const grid1 = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
const grid2 = '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......';
const hard1 = '.....6....59.....82....8....45........3........6..3.54...325..6..................';
/* eslint-enable */

/**
 * Track time to solve grid.
 *
 * @param {any} grid
 * @return {Array<Time, Boolean>}
 */
function timeSolve(grid) {
  const start = process.hrtime();
  const values = solve(grid);
  const end = process.hrtime(start);
  const t = end[0] * 1000 + end[1] / 1000000;
  return [t, solved(values)];
}

/**
 * Check if grid has been solved
 *
 * @param {any} values
 * @return {Boolean}
 */
function solved(values) {
  if (!values) {
    console.log('Solved failed with values');
    return false;
  }
  return unitlist.every(unit => {
    const digitSet = new Set(digits.split(''));
    const unitSet = new Set(unit.map(s => values.get(s)).sort());
    return digitSet.size == unitSet.size && [...digitSet].every(d => unitSet.has(d));
  });
}

/**
 * Solve all the grids
 *
 * @param {any} grids
 * @param {string} [name='']
 **/
function solveAll(grids, name = '') {
  const [times, results] = zip(...grids.map(grid => timeSolve(grid)));
  if (results.some(r => r == false)) {
    console.log('Could not solve grid' + name);
    process.exit();
  }
  const N = results.length;
  if (N < 1) {
    return;
  }
  let printTimeInfo = `(avg ${sum(times) / N} ms (${N / sum(times)} KHz), max ${Math.max(...times)}`;
  console.log(`Solved ${results.length} of ${N} ${name} puzzles ${printTimeInfo}`);
}

if (require.main === module) {
  solveAll(
    fs
      .readFileSync('src/sudoku/sudoku-easy50.txt')
      .toString()
      .split('\n'),
    'easy'
  );
  solveAll(
    fs
      .readFileSync('src/sudoku/sudoku-top95.txt')
      .toString()
      .split('\n'),
    'hard'
  );
  solveAll(
    fs
      .readFileSync('src/sudoku/sudoku-hardest.txt')
      .toString()
      .split('\n'),
    'hardest'
  );
}
