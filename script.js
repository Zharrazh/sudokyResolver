



const initSudokuTableString = `
. . . . 4 . . 2 6
3 . 9 7 2 . . . .
. 5 . . . . 4 . .

. . 7 9 1 3 . . .
6 . 3 . . . . . .
. . . . . . 3 4 2

1 . . . . 9 . 8 .
. . . . . 8 . . 9
. 9 . . . . 7 . 4
`

// `
// . . . . . . . . .
// . . . . . . . . .
// . . . . . . . . .

// . . . . . . . . .
// . . . . . . . . .
// . . . . . . . . .

// . . . . . . . . .
// . . . . . . . . .
// . . . . . . . . .
// `


const parseSudokuTableString = str => {
    const rows = str.split('\n').filter(str => str !== "")
    const parseRowStr = (rowStr) => {
        return rowStr.split(' ').map(value => value === '.'? null : Number.parseInt(value))
    }

    return rows.map(parseRowStr)
}


const initSudokuState = parseSudokuTableString(initSudokuTableString)

console.log("Начальное состояние", initSudokuTableString)
const res =  resolveSudoku(initSudokuState)

console.log('Результат', res)