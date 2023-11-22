import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import {
  createQuestion,
  createManyQuestions,
  generatePaper,
} from '../services/question.service';
import { Question } from '@prisma/client';
import fs from 'fs/promises';

export const addQuestionsContoller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.body.question) {
      const question: Question = req.body;
      const data = await createQuestion(question);
      return res.status(201).json(data);
    }

    if (req.file) {
      const file = req.file;

      const fileData = await fs.readFile(file.path);
      const fileDataString = fileData.toString();
      const questions: Question[] = JSON.parse(fileDataString);

      await createManyQuestions(questions);
      return res
        .status(201)
        .json({ message: `${questions.length} questions added` });
    }
  } catch (error) {
    next(error);
  }
};

export const generatePaperController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // basis = difficulty/topic/subject
    // distribution = {easy:20,medium:60,hard:20}/{physics:20,biology:60,chemistry:20}
    const { basis, totalMarks, distribution } = req.body;

    if (!basis || !totalMarks || !distribution) {
      throw createHttpError(
        400,
        'basis, totalMarks and distribution are required',
      );
    }

    const data = await generatePaper(basis, totalMarks, distribution);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
