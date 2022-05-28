/**
 * BMR Calculation
 * @param plan
 * @param goal
 * @param userage
 * @param gender
 */
export const calorieCalculator = (
  plans: string,
  level: string,
  goal: string,
  userage: string,
  gender: string,
  cm: string,
  kg: string,
) => {
  const planType: string = plans;
  const levelType: string = level;
  const genderType: string = gender;
  const programType: string = goal;
  const weight: number = parseInt(kg);
  const height: number = parseInt(cm);
  const age: number = parseInt(userage);

  console.log('calorieCalculator', level);
  switch (planType) {
    case 'Athlete':
    case 'Classic':
      //Sedentary
      if (levelType == 'Sedentary' && genderType == 'male') {
        const mainMale: number = 10 * weight + 6.25 * height - 5 * age + 5;
        if (programType == 'maintain') {
          return mainMale;
        }
        if (programType == 'loss') {
          return mainMale - (mainMale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainMale + (mainMale * 20) / 100;
        }
      }

      if (levelType == 'Sedentary' && genderType == 'female') {
        const mainFemale: number = 10 * weight + 6.25 * height - 5 * age - 161;
        if (programType == 'maintain') {
          return mainFemale;
        }
        if (programType == 'loss') {
          return mainFemale - (mainFemale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainFemale + (mainFemale * 20) / 100;
        }
      }

      //Lightly active
      if (levelType == 'Lightly active' && genderType == 'male') {
        const mainMale: number =
          (10 * weight + 6.25 * height - 5 * age + 5) * 1.1;
        if (programType == 'maintain') {
          return mainMale;
        }
        if (programType == 'loss') {
          return mainMale - (mainMale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainMale + (mainMale * 20) / 100;
        }
      }

      if (levelType == 'Lightly active' && genderType == 'female') {
        const mainFemale: number =
          (10 * weight + 6.25 * height - 5 * age - 161) * 1.1;
        if (programType == 'maintain') {
          return mainFemale;
        }
        if (programType == 'loss') {
          return mainFemale - (mainFemale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainFemale + (mainFemale * 20) / 100;
        }
      }

      //Moderately active
      if (levelType == 'Moderately active' && genderType == 'male') {
        const mainMale: number =
          (10 * weight + 6.25 * height - 5 * age + 5) * 1.2;
        if (programType == 'maintain') {
          return mainMale;
        }
        if (programType == 'loss') {
          return mainMale - (mainMale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainMale + (mainMale * 20) / 100;
        }
      }

      if (levelType == 'Moderately active' && genderType == 'female') {
        const mainFemale: number =
          (10 * weight + 6.25 * height - 5 * age - 161) * 1.2;
        if (programType == 'maintain') {
          return mainFemale;
        }
        if (programType == 'loss') {
          return mainFemale - (mainFemale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainFemale + (mainFemale * 20) / 100;
        }
      }

      // Very active
      if (levelType == 'Very active' && genderType == 'male') {
        const mainMale: number =
          (10 * weight + 6.25 * height - 5 * age + 5) * 1.4;
        if (programType == 'maintain') {
          return mainMale;
        }
        if (programType == 'loss') {
          return mainMale - (mainMale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainMale + (mainMale * 20) / 100;
        }
      }

      if (levelType == 'Very active' && genderType == 'female') {
        const mainFemale: number =
          (10 * weight + 6.25 * height - 5 * age - 161) * 1.4;
        if (programType == 'maintain') {
          return mainFemale;
        }
        if (programType == 'loss') {
          return mainFemale - (mainFemale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainFemale + (mainFemale * 20) / 100;
        }
      }

      // Super active
      if (levelType == 'Super active' && genderType == 'male') {
        const mainMale: number =
          (10 * weight + 6.25 * height - 5 * age + 5) * 1.6;
        if (programType == 'maintain') {
          return mainMale;
        }
        if (programType == 'loss') {
          return mainMale - (mainMale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainMale + (mainMale * 20) / 100;
        }
      }

      if (levelType == 'Super active' && genderType == 'female') {
        const mainFemale: number =
          (10 * weight + 6.25 * height - 5 * age - 161) * 1.6;
        if (programType == 'maintain') {
          return mainFemale;
        }
        if (programType == 'loss') {
          return mainFemale - (mainFemale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainFemale + (mainFemale * 20) / 100;
        }
      }
      return;
    case 'Keto':
      //Sedentary
      if (levelType == 'Sedentary' && genderType == 'male') {
        const mainMale: number =
          10 * weight +
          6.25 * height -
          5 * age +
          5 +
          (10 * weight + 6.25 * height - 5 * age + 5) * 0.3 +
          (10 * weight +
            6.25 * height -
            5 * age +
            5 +
            (10 * weight + 6.25 * height - 5 * age + 5) * 0.3) /
            10;

        if (programType == 'maintain') {
          return mainMale;
        }
        if (programType == 'loss') {
          return mainMale - (mainMale * 30) / 100;
        }
        if (programType == 'gain') {
          return mainMale + (mainMale * 25) / 100;
        }
      }

      if (levelType == 'Sedentary' && genderType == 'female') {
        const mainFemale: number =
          10 * weight +
          6.25 * height -
          5 * age -
          161 +
          (10 * weight + 6.25 * height - 5 * age - 161) * 0.3 +
          (10 * weight +
            6.25 * height -
            5 * age -
            161 +
            (10 * weight + 6.25 * height - 5 * age - 161) * 0.3) /
            10;
        if (programType == 'maintain') {
          return mainFemale;
        }
        if (programType == 'loss') {
          return mainFemale - (mainFemale * 30) / 100;
        }
        if (programType == 'gain') {
          return mainFemale + (mainFemale * 25) / 100;
        }
      }

      //Lightly active
      if (levelType == 'Lightly active' && genderType == 'male') {
        const mainMale: number =
          10 * weight +
          6.25 * height -
          5 * age +
          5 +
          (10 * weight + 6.25 * height - 5 * age + 5) * 0.6 +
          (10 * weight +
            6.25 * height -
            5 * age +
            5 +
            (10 * weight + 6.25 * height - 5 * age + 5) * 0.6) /
            10;
        if (programType == 'maintain') {
          return mainMale;
        }
        if (programType == 'loss') {
          return mainMale - (mainMale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainMale + (mainMale * 20) / 100;
        }
      }

      if (levelType == 'Lightly active' && genderType == 'female') {
        const mainFemale: number =
          10 * weight +
          6.25 * height -
          5 * age -
          161 +
          (10 * weight + 6.25 * height - 5 * age - 161) * 0.5 +
          (10 * weight +
            6.25 * height -
            5 * age -
            161 +
            (10 * weight + 6.25 * height - 5 * age - 161) * 0.5) /
            10;
        if (programType == 'maintain') {
          return mainFemale;
        }
        if (programType == 'loss') {
          return mainFemale - (mainFemale * 20) / 100;
        }
        if (programType == 'gain') {
          return mainFemale + (mainFemale * 20) / 100;
        }
      }

      //Moderately active
      if (levelType == 'Moderately active' && genderType == 'male') {
        const mainMale: number =
          10 * weight +
          6.25 * height -
          5 * age +
          5 +
          (10 * weight + 6.25 * height - 5 * age + 5) * 0.7 +
          (10 * weight +
            6.25 * height -
            5 * age +
            5 +
            (10 * weight + 6.25 * height - 5 * age + 5) * 0.7) /
            10;
        if (programType == 'maintain') {
          return mainMale;
        }
        if (programType == 'loss') {
          return mainMale - (mainMale * 30) / 100;
        }
        if (programType == 'gain') {
          return mainMale + (mainMale * 25) / 100;
        }
      }

      if (levelType == 'Moderately active' && genderType == 'female') {
        const mainFemale: number =
          10 * weight +
          6.25 * height -
          5 * age -
          161 +
          (10 * weight + 6.25 * height - 5 * age - 161) * 0.6 +
          (10 * weight +
            6.25 * height -
            5 * age -
            161 +
            (10 * weight + 6.25 * height - 5 * age - 161) * 0.6) /
            10;
        if (programType == 'maintain') {
          return mainFemale;
        }
        if (programType == 'loss') {
          return mainFemale - (mainFemale * 30) / 100;
        }
        if (programType == 'gain') {
          return mainFemale + (mainFemale * 25) / 100;
        }
      }

      // Very active
      if (levelType == 'Very active' && genderType == 'male') {
        const mainMale: number =
          10 * weight +
          6.25 * height -
          5 * age +
          5 +
          (10 * weight + 6.25 * height - 5 * age + 5) * 1.1 +
          (10 * weight +
            6.25 * height -
            5 * age +
            5 +
            (10 * weight + 6.25 * height - 5 * age + 5) * 1.1) /
            10;
        if (programType == 'maintain') {
          return mainMale;
        }
        if (programType == 'loss') {
          return mainMale - (mainMale * 30) / 100;
        }
        if (programType == 'gain') {
          return mainMale + (mainMale * 25) / 100;
        }
      }

      if (levelType == 'Very active' && genderType == 'female') {
        const mainFemale: number =
          10 * weight +
          6.25 * height -
          5 * age -
          161 +
          (10 * weight + 6.25 * height - 5 * age - 161) * 0.9 +
          (10 * weight +
            6.25 * height -
            5 * age -
            161 +
            (10 * weight + 6.25 * height - 5 * age - 161) * 0.9) /
            10;
        if (programType == 'maintain') {
          return mainFemale;
        }
        if (programType == 'loss') {
          return mainFemale - (mainFemale * 30) / 100;
        }
        if (programType == 'gain') {
          return mainFemale + (mainFemale * 25) / 100;
        }
      }

      // Super active
      if (levelType == 'Super active' && genderType == 'male') {
        const mainMale: number =
          10 * weight +
          6.25 * height -
          5 * age +
          5 +
          (10 * weight + 6.25 * height - 5 * age + 5) * 1.4 +
          (10 * weight +
            6.25 * height -
            5 * age +
            5 +
            (10 * weight + 6.25 * height - 5 * age + 5) * 1.4) /
            10;
        if (programType == 'maintain') {
          return mainMale;
        }
        if (programType == 'loss') {
          return mainMale - (mainMale * 30) / 100;
        }
        if (programType == 'gain') {
          return mainMale + (mainMale * 25) / 100;
        }
      }

      if (levelType == 'Super active' && genderType == 'female') {
        const mainFemale: number =
          10 * weight +
          6.25 * height -
          5 * age -
          161 +
          (10 * weight + 6.25 * height - 5 * age - 161) * 1.2 +
          (10 * weight +
            6.25 * height -
            5 * age -
            161 +
            (10 * weight + 6.25 * height - 5 * age - 161) * 1.2) /
            10;
        if (programType == 'maintain') {
          return mainFemale;
        }
        if (programType == 'loss') {
          return mainFemale - (mainFemale * 30) / 100;
        }
        if (programType == 'gain') {
          return mainFemale + (mainFemale * 25) / 100;
        }
      }
      return;
    default:
      return;
  }
};

export const athleteCalculator = (calor: number) => {
  const calorie: number = calor;

  const protein = ((calorie * 30) / 100 / 4).toFixed();
  const carbohydrate = ((calorie * 40) / 100 / 4).toFixed();
  const fat = ((calorie * 30) / 100 / 9).toFixed();

  return { protein, carbohydrate, fat };
};

export const proteinCalculate = (calorie: number) => {
  const cal = ((calorie * 30) / 100 / 4).toFixed();
  return cal;
};

export const carbohydrateCalculate = (calorie: number) => {
  const cal = ((calorie * 40) / 100 / 4).toFixed();
  return cal;
};

export const fatCalculate = (calorie: number) => {
  const cal = ((calorie * 30) / 100 / 9).toFixed();
  return cal;
};
