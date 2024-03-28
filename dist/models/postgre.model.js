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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pg_1 = require("pg");
const postgres_uri = process.env.POSTGRES_URI;
class PostgreSQL {
    constructor() {
        this.client = new pg_1.Client({
            connectionString: postgres_uri
        });
        this.client.connect();
    }
    static getInstance() {
        if (!PostgreSQL.instance) {
            PostgreSQL.instance = new PostgreSQL();
        }
        return PostgreSQL.instance;
    }
    query(query, values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.client.query(query, values);
                return result;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.end();
                console.log('Disconnected from PostgreSQL');
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = PostgreSQL;
