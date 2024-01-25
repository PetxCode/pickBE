"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const articleModel = new mongoose_1.Schema({
    articleTitle: {
        type: String,
    },
    articleImage: {
        type: String,
    },
    articleContent: {
        type: String,
    },
    articleDescription: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("articles", articleModel);
