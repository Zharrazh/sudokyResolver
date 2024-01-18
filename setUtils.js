const getSetsSum = sets => {
    const res = new Set()

    for(let set of sets){
        for(let item of set){
            res.add(item)
        }
    }

    return res
}

const getSetsIntersec = (sets) => {
    let smallestSet = sets[0]
    for (let set of sets){
        if(set.size < smallestSet.size){
            smallestSet = set
        }
    }

    const res = new Set()

    for(let testItem of smallestSet){
        if(sets.every(set => set.has(testItem))){
            res.add(testItem)
        }
    }

    return res

}

const getUnicItemInSets = sets => {
    const all = getSetsSum(sets)
    for (let item of all){
        let acc = 0

        for(set of sets){
            if(set.has(item)){
                acc++
            }

            if( acc > 1){
                break
            }
        }

        if(acc === 1){
            return item
        }

    }

    return null
}