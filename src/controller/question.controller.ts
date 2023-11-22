import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import {
  createQuestion,
  createManyQuestions,
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
