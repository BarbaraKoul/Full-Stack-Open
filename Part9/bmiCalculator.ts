interface BmiValues {
  value1: number
  value2: number
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments')
  if (args.length > 4) throw new Error('Too many arguments')

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  }
  else if(Number(args[2])||Number(args[3])){
    throw new Error('values cannot be zero')
  }
  else {
    throw new Error('Provided values were not numbers!')
  }
}

const calculateBmi = (h:number, w:number): string => {
    const BMI = (10000*w)/(h*h)
    if(BMI<18.5){
        return 'Underweight'
    }
    else if(BMI<24.9){
        return 'Healthy Weight'
    }
    else if(BMI<29.9){
        return 'Overweight'
    }
    else{
        return 'Obesity'
    }
}

try{
    const { value1, value2 } = parseArguments(process.argv)
    console.log(calculateBmi(value1, value2))
} 
catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
