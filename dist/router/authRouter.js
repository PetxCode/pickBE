"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const authController_1 = require("../controller/authController");
const upload = (0, multer_1.default)().single("avatar");
const router = (0, express_1.Router)();
router.route("/one-user/:userID").get(authController_1.readOneAuth);
/**
 * @swagger
 * /api/v1/all-user:
 *   get:
 *     description: Get all studio owners
 *     responses:
 *       200:
 *         description: Success
 *
 */
router.route("/all-user").get(authController_1.readAllAuth);
router.route("/sign-user").post(authController_1.signInUser);
// /**
//  * /user:
//     post:
//       tags:
//         - user
//       summary: Create user
//       description: This can only be done by the logged in user.
//       operationId: createUser
//       requestBody:
//         description: Created user object
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/User'
//           application/xml:
//             schema:
//               $ref: '#/components/schemas/User'
//           application/x-www-form-urlencoded:
//             schema:
//               $ref: '#/components/schemas/User'
//       responses:
//         default:
//           description: successful operation
//           content:
//             application/json:
//               schema:
//                 $ref: '#/components/schemas/User'
//             application/xml:
//               schema:
//                 $ref: '#/components/schemas/User'
//  */
/**
 * @swagger
 * /api/v1/create-user:
 *   post:
 *     description: This route will be used to create a new user
 *     summary: creating a new user
 *     operationId: createUser
 *     requestBody:
 *      description: Created user object
 *      content:
//  *        application/json:

 *
 *
 *     responses:
 *       201:
 *         description: Success
 *
 */
router.route("/create-user").post(authController_1.createAuth);
router.route("/verify-user/:userID").get(authController_1.verifyUser);
router.route("/update-one-user/:userID").patch(upload, authController_1.updateOneAuthAvatar);
router.route("/update-one-user-info/:userID").patch(authController_1.updateOneAuthInfo);
exports.default = router;
