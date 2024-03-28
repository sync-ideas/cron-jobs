import PostgreSQL from "../models/postgre.model";

class CronController {

  public async updateAttendance(): Promise<void> {
    try {

      // Get all inactive students
      let students = await PostgreSQL.getInstance().query(`
        SELECT *
        FROM students
        WHERE "active" = false
      `)
      // Update all inactive students attendances
      const idsToRegister = students.rows.map((student: any) => student.id)
      await PostgreSQL.getInstance().query(`
        UPDATE attendances
        SET "registered" = true
        WHERE "studentId" IN (${idsToRegister})
      `)

      // Get all active students
      students = await PostgreSQL.getInstance().query(`
        SELECT *
        FROM students
        WHERE "active" = true
      `)
      // Get all dates with attendances not registered
      const dates = await PostgreSQL.getInstance().query(`
        SELECT DATE("date") AS day
        FROM attendances
        WHERE "registered" = false
        GROUP BY day
      `)

      // Check attendances for each date for all active students
      for (const date of dates.rows) {
        for (const student of students.rows) {
          const attendances = await PostgreSQL.getInstance().query(`
            SELECT *
            FROM attendances
            WHERE
             "studentId" = ${student.id} AND
             DATE(date) = DATE('${new Date(date.day).toISOString().slice(0, 10)}') AND
             "registered" = false
          `)

          // If there are no attendances for the date
          if (!attendances || attendances.rows.length === 0) { // If there are no attendances for the date
            await PostgreSQL.getInstance().query(`
               INSERT INTO nonattendances ("studentId", "date", "subjectId")
               VALUES (${student.id}, '${new Date(date.day).toISOString().slice(0, 10)}', ${67})
             `)
          } else {
            if (attendances.rows.length > 1) { // If there are more than one attendance for the date conserving the first one
              const idsToDelete = attendances.rows.slice(1).map((attendance: any) => attendance.id)
              await PostgreSQL.getInstance().query(`
                  DELETE FROM attendances
                  WHERE id IN (${idsToDelete})
            `)
            }
            // Update attendance register
            await PostgreSQL.getInstance().query(` 
             UPDATE attendances
             SET "registered" = true
             WHERE id = ${attendances.rows[0].id}
           `)
          }

        }
      }
      PostgreSQL.getInstance().close()
    } catch (error) {
      console.log(error)
      throw error
    }
  }

}

export default new CronController()