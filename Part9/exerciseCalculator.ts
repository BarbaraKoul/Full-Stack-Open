interface exCalc {
    value1: number
    value2: number[]
}

const parseArgs=(args: string[]): exCalc => {
    if(args.length<4) throw new Error('not enough information')

    const value2: number[] = []

    for(let i=3; i<args.length; i++){
        if(isNaN(Number(args[i]))){
            throw new Error('parameters are not numbers!')
        }
        value2.push(Number(args[i]))
    }
    return{
        value1: Number(args[2]),
        value2: value2
    }
}

interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number
    comment: string
    target: number
    average: number
}

const calculateExercises = (g: number, d:number[]): Result => {
    let sum=0
    let rating =0
    let comment=''
    let target=g
    
    const periodLength=d.length
    const trainingDays= periodLength-d.filter(day => day === 0).length

    for(let i=0; i<d.length; i++){
        sum+=d[i]
    }

    const average= sum/periodLength
    const success=average>g

    if(average>=g){
        rating=3
        comment='Excellent Job!'
    }
    else if( g-average>3){
        rating=2
        comment='Great, but you could do better!'
    }
    else{
        rating=1
        comment='Work harder!'
    }
    
    return {
        periodLength,
        trainingDays,
        success,
        rating,
        comment,
        target,
        average
    } 
    
}

try{
    const {value1, value2}=parseArgs(process.argv)
    console.log(calculateExercises(value1, value2))
}
catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
