import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv'
dotenv.config()

import postgreInstance from "./models/postgre.model";
import cronInstance from "./controllers/cron.controller";

const PORT = process.env.PORT || 3000
const app = express();
app.use(cors())
app.use('/', express.Router().get(
  '/', (req: Request, res: Response) => {
    cron()
    res.send('Cron working...')
  }
))

async function cron() {
  try {
    await cronInstance.updateAttendance()
  } catch (error) {
    console.log(error)
    postgreInstance.getInstance().close()
  }
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
