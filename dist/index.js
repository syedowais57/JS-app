"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const PORT = 3000;
(0, utils_1.greet)('Owais');
app.get('/', (req, res) => {
    res.send('Owais - Build Success!');
});
