"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const config_1 = require("./config");
const app = (0, express_1.default)();
const config = (0, config_1.getConfig)();
const PORT = config.port;
app.get('/', (req, res) => {
    const message = (0, utils_1.greet)('World');
    res.json({
        message,
        timestamp: new Date().toISOString(),
        apiVersion: config.apiVersion,
    });

