import { Question } from '@prisma/client';
import prisma from '../client';
import createHttpError from 'http-errors';

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
