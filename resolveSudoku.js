const allOptions = [1, 2 ,3, 4, 5, 6, 7, 8, 9]

const getRowAndColAllowedOptions = (table) => {

    const rowSets = new Array(9)
    const colSets = new Array(9)

    for(r = 0; r < 9; r++){
        const rRow = table[r].filter(value => value !== null)
        rowSets[r] = new Set(allOptions)
        rRow.forEach(value => rowSets[r].delete(value))
    }

    for(c = 0; c < 9; c++){
        const cCol = table.map(row => row[c]).filter(value => value !== null)
        colSets[c] = new Set(allOptions)
        cCol.forEach(value => colSets[c].delete(value))
    }

    return [rowSets, colSets]
}

const getSectorsAllowedOptions = (table) => {
    const res = [
        [new Set(allOptions), new Set(allOptions), new Set(allOptions)],
        [new Set(allOptions), new Set(allOptions), new Set(allOptions)],
        [new Set(allOptions), new Set(allOptions), new Set(allOptions)],
    ] 

    for(r = 0; r < 9; r++){
        for(c = 0; c < 9; c++){
            const rcValue = table[r][c]
            if(rcValue !== null){
                res[Math.floor(r / 3)][Math.floor(c/ 3)].delete(rcValue)
            }
        }
    }

    return res
}


const getUnresolvedCells = (table, rowSets, colSets, groupSets) => {
    const res = []

    for(r = 0; r < 9; r++){
        for(c = 0; c < 9; c++){
            if(table[r][c] === null){
                res.push({
                    r,
                    c,
                    options: getSetsIntersec([rowSets[r], colSets[c], groupSets[Math.floor(r / 3)][Math.floor(c/ 3)]])
                })
            }
        }
    }

    return res
}

const getGroupedCells = options => {
    const res = []

    for(r = 0; r < 9; r++){
        res.push(options.filter(option => option.r === r))
    }

    for(c = 0; c < 9; c++){
        res.push(options.filter(option => option.c === c))
    }

    for(secR = 0; secR < 3; secR++){
        for(secC = 0; secC < 3; secC++){
            res.push(options.filter(option => 
                option.r >= secR * 3 && 
                option.r < (secR + 1) * 3 && 
                option.c >= secC * 3 && 
                option.c < (secC + 1) * 3))
        }
    }

    return res.filter(group => group.length)
}



const resolveSudoku = (initState) => {

    const lenRows = initState.length
    const lenCols = Math.min(...initState.map(row => row.length))

    if(lenRows !== 9 || lenCols !== 9){
        throw new Error(`На вход поступило поле неверной формы (${lenCols}x${lenRows})`)
    }

    let resState = initState.map(row => [...row])

    let [rowSets, colSets] = getRowAndColAllowedOptions(resState)

    let groupSets = getSectorsAllowedOptions(resState)

    let unresolvedCells = getUnresolvedCells(resState, rowSets, colSets, groupSets)


    const resolveCell = (r, c, value) => {
        resState[r][c] = value
        rowSets[r].delete(value)
        colSets[c].delete(value)
        groupSets[Math.floor(r / 3)][Math.floor(c/ 3)].delete(value)
        unresolvedCells = getUnresolvedCells(resState, rowSets, colSets, groupSets)
    }

    const copyResState = (state) => {
        return state.map(row => [...row])
    }


    while(unresolvedCells.length > 0){
        if(!unresolvedCells.every(cell => cell.options.size > 0)){
            throw new Error('решений нет')
        }
        const unresolvedCellWithOneOption = unresolvedCells.find(({options}) => options.size === 1)
        if(unresolvedCellWithOneOption){
            resolveCell(unresolvedCellWithOneOption.r, unresolvedCellWithOneOption.c, Array.from(unresolvedCellWithOneOption.options)[0])
            continue
        }


        const cellGroups = getGroupedCells(unresolvedCells)

        console.log('Перебор решений по уникальным опциям в группах', cellGroups)

        let isCellWithUnicOptionWasFined = false

        for(let cellGroup of cellGroups){
            const unicOption = getUnicItemInSets(cellGroup.map(cell => cell.options))

            if(unicOption !== null){
                const cellWithUnicOption = cellGroup.find(cell => cell.options.has(unicOption))

                if(cellWithUnicOption){
                    resolveCell(cellWithUnicOption.r, cellWithUnicOption.c, unicOption)
                    isCellWithUnicOptionWasFined = true
                    console.log("Уникальная опция в группах найдена", cellGroup, cellWithUnicOption, unicOption)
                    break
                }
            }
        }

        if(!isCellWithUnicOptionWasFined){
            const sortedUnresolvedCells = unresolvedCells.sort((a, b) => a.options.size - b.options.size)
            console.log('unresolvedCells', sortedUnresolvedCells)
            const cellWithMinOptions = sortedUnresolvedCells[0]
            console.log("Не нашлось однозначного решения. Ищем по всем вариантам с самым маленьким кол-вом опций", cellWithMinOptions)
            if(cellWithMinOptions){

                const options = Array.from(cellWithMinOptions.options)
                let isSolutionWasFined = false
                let i = 0

                while(i < options.length && !isSolutionWasFined){
                    try{
                        const currentOption = options[i]
                        console.log(`Попробуем ${i + 1}ое решение для данной ячейки (${currentOption})`, cellWithMinOptions)
                        
                        const copy = copyResState(resState)
                        copy[cellWithMinOptions.r][cellWithMinOptions.c] = currentOption
                        const res = resolveSudoku(copy)
                        isSolutionWasFined = true
                        return res
                    }catch{
                        console.log('Решение не подошло')
                        i++
                    }
                }

                if(!isSolutionWasFined){
                    throw new Error('Не нашлось решения ни для одной из опций', cellWithMinOptions)
                }
                
            }else{
                throw new Error('Не нашлось ни одной незаполненной клетки')
            }
        }

        
    }

    return resState

}