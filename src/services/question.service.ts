import { Prisma, Question } from '@prisma/client';
import prisma from '../client';
import createHttpError from 'http-errors';
import { getQuestionsWithSumWeightage } from '../utils/findCombination';

export const createManyQuestions = async (
  questions: Question[],
): Promise<void> => {
  try {
    await prisma.question.createMany({
      data: questions,
      skipDuplicates: true,
    });
  } catch (error) {
    throw createHttpError(500, 'Error creating questions');
  }
};

export const createQuestion = async (question: Question): Promise<Question> => {
  if (!question) {
    throw new Error('Question is required');
  }

  try {
    return await prisma.question.create({
      data: question,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(500, 'Error creating question');
  }
};

export const generatePaper = async (
  basis: string,
  totalMarks: number,
  distribution: any,
): Promise<Question[]> => {
  let finalList: Question[] = [];
  for (const basisType in distribution) {
    //in percentage
    const percentage = distribution[basisType];

    //weightage
    const weightage = (percentage / 100) * totalMarks;

    if (weightage === 0) {
      continue;
    }

    // fetching questions of basis type

    const whereCondition: any = {};
    whereCondition[basis] = basisType;

    // querying questions based on basis type eg. difficulty = easy
    const questions: Question[] = await prisma.$queryRaw`
      SELECT *
      FROM "Question" WHERE ${Prisma.sql`${Prisma.raw(basis)} = '${Prisma.raw(
        basisType,
      )}'`}
      ORDER BY RANDOM();
      `;

    // get list of questions having sum weightage

    const selectedQuestions = getQuestionsWithSumWeightage(
      questions,
      weightage,
    );

    // if no questions found for the basis type
    if (selectedQuestions.length == 0) {
      console.log(
        `No questions found for ${basisType}, weightage: ${weightage}`,
      );
      throw createHttpError(
        400,
        'Cannot Collect Question with given distribution',
      );
    }

    //push to the final list
    finalList = [...finalList, ...selectedQuestions];
  }

  return finalList;
};
