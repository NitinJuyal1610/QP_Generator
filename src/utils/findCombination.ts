import { Question } from '@prisma/client';

export const getQuestionsWithSumWeightage = (
  questions: Question[],
  targetSum: number,
): Question[] => {
  const dp = Array(targetSum + 1).fill(false);
  dp[0] = true;

  for (const question of questions) {
    for (let sum = targetSum; sum >= question.marks; sum--) {
      dp[sum] = dp[sum] || dp[sum - question.marks];
    }
  }

  if (!dp[targetSum]) {
    console.log(`No combination found for the target sum of ${targetSum}`);
    return [];
  }

  let currentSum = targetSum;
  const selectedQuestions: Question[] = [];

  for (const question of questions.reverse()) {
    if (currentSum >= question.marks && dp[currentSum - question.marks]) {
      selectedQuestions.push(question);
      currentSum -= question.marks;
    }
  }

  return selectedQuestions;
};
