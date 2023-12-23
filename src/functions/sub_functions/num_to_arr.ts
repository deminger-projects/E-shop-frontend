export default function num_to_arr(num: number){

    var arr: Array<number> = []

    for (let index = 1; index <= num && index <= 10; index++) {
        arr.push(index)
    }

    return arr

}