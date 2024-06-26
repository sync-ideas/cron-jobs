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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const postgre_model_1 = __importDefault(require("./models/postgre.model"));
const cron_controller_1 = __importDefault(require("./controllers/cron.controller"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use('/', express_1.default.Router().get('/', (req, res) => {
    cron();
    res.send('Cron working...');
}));
function cron() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield cron_controller_1.default.updateAttendance();
        }
        catch (error) {
            console.log(error);
            postgre_model_1.default.getInstance().close();
        }
    });
}
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
