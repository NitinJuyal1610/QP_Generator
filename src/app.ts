import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import prisma from './client';
import questionRoute from './routes/question.route';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', questionRoute);

app.use((err: any, req: any, res: any, next: any) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).send({
    message,
    status,
  });
});
//connect prisma client here
const port = process.env.PORT || 3000;

prisma.$connect().then(() => {
  console.log('Prisma connected');
  app.listen(port, () => {
    console.log(`Application started at port ${port}`);
  });
});
