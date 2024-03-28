import postgreInstance from "./models/postgre.model";
import cronInstance from "./controllers/cron.controller";


async function main() {
  try {
    await cronInstance.updateAttendance()
  } catch (error) {
    console.log(error)
    postgreInstance.getInstance().close()
  }
}


main()