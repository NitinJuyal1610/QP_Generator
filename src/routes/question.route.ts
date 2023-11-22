import { Router } from 'express';
import multer from 'multer';

export const MulterUpload = multer({
  dest: 'uploads/',
});

import {
  addQuestionsContoller,
  generatePaperController,
} from '../controller/question.controller';

const router = Router();

router.post('/questions', MulterUpload.single('file'), addQuestionsContoller);
router.get('/questions', generatePaperController);

export default router;
