"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgre_model_1 = __importDefault(require("../models/postgre.model"));
class CronController {
    updateAttendance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all inactive students
                let students = yield postgre_model_1.default.getInstance().query(`
        SELECT *
        FROM students
        WHERE "active" = false
      `);
                // Update all inactive students attendances
                const idsToRegister = students.rows.map((student) => student.id);
                yield postgre_model_1.default.getInstance().query(`
        UPDATE attendances
        SET "registered" = true
        WHERE "studentId" IN (${idsToRegister})
      `);
                // Get all active students
                students = yield postgre_model_1.default.getInstance().query(`
        SELECT *
        FROM students
        WHERE "active" = true
      `);
                // Get all dates with attendances not registered
                const dates = yield postgre_model_1.default.getInstance().query(`
        SELECT DATE("date") AS day
        FROM attendances
        WHERE "registered" = false
        GROUP BY day
      `);
                // Check attendances for each date for all active students
                for (const date of dates.rows) {
                    for (const student of students.rows) {
                        const attendances = yield postgre_model_1.default.getInstance().query(`
            SELECT *
            FROM attendances
            WHERE
             "studentId" = ${student.id} AND
             DATE(date) = DATE('${new Date(date.day).toISOString().slice(0, 10)}') AND
             "registered" = false
          `);
                        // If there are no attendances for the date
                        if (!attendances || attendances.rows.length === 0) { // If there are no attendances for the date
                            yield postgre_model_1.default.getInstance().query(`
               INSERT INTO nonattendances ("studentId", "date", "subjectId")
               VALUES (${student.id}, '${new Date(date.day).toISOString().slice(0, 10)}', ${67})
             `);
                        }
                        else {
                            if (attendances.rows.length > 1) { // If there are more than one attendance for the date conserving the first one
                                const idsToDelete = attendances.rows.slice(1).map((attendance) => attendance.id);
                                yield postgre_model_1.default.getInstance().query(`
                  DELETE FROM attendances
                  WHERE id IN (${idsToDelete})
            `);
                            }
                            // Update attendance register
                            yield postgre_model_1.default.getInstance().query(` 
             UPDATE attendances
             SET "registered" = true
             WHERE id = ${attendances.rows[0].id}
           `);
                        }
                    }
                }
                postgre_model_1.default.getInstance().close();
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = new CronController();
