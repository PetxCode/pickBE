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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const mongoose_1 = require("mongoose");
// const URL: string = "mongodb://127.0.0.1:27017/pickDB";
// const URL: string =
//   "mongodb+srv://brighterdayscodelab:brighterdayscodelab@cluster0.upn8ipm.mongodb.net/pickDB?retryWrites=true&w=majority";
// const URL: string =
//   "mongodb+srv://brighterdayscodelab:brighterdayscodelab@cluster0.6d4tpug.mongodb.net/pickDB?retryWrites=true&w=majority";
const URL = "mongodb+srv://shecodesaj:shecodesaj@cluster0.xe1jgnf.mongodb.net/pickDB?retryWrites=true&w=majority";
const dbConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connect)(URL).then(() => {
            console.log("Database is now connected...🚀🚀🚀");
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.dbConfig = dbConfig;
