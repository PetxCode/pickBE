"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const multer_1 = __importDefault(require("multer"));
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
router.route("/create-admin").post(authController_1.createAdminAuth);
router.route("/create-artist").post(authController_1.createArtistAuth);
router.route("/create-user").post(authController_1.createUserAuth);
router.route("/verify-user").post(authController_1.verifyUser);
router.route("/single-account/:userID").get(authController_1.singleAccountName);
router.route("/update-one-user/:userID").patch(upload, authController_1.updateOneAuthAvatar);
router.route("/update-one-user-info/:userID").patch(authController_1.updateOneAuthInfo);
router.route("/update-account-name/:userID").patch(authController_1.updateBankAccountName);
router.route("/update-bank-name/:userID").patch(authController_1.updateBankName);
router.route("/update-account-number/:userID").patch(authController_1.updateAccountNumber);
router.route("/delete-user/:userID").delete(authController_1.deleteOneAuth);
router.route("/update-one-user-lang/:userID").patch(authController_1.updateOneAuthInfoLang);
router.route("/update-one-user-bio/:userID").patch(authController_1.updateOneAuthInfoBio);
router
    .route("/update-one-user-contact/:userID")
    .patch(authController_1.updateOneAuthInfoContact);
router
    .route("/update-one-user-profession/:userID")
    .patch(authController_1.updateOneAuthInfoProfession);
router.route("/update-one-user-phone/:userID").patch(authController_1.updateOneAuthInfoPhone);
exports.default = router;
