import { Router } from "express";
import {
  createUserAuth,
  createAdminAuth,
  createArtistAuth,
  updateOneAuthAvatar,
  readAllAuth,
  readOneAuth,
  signInUser,
  updateOneAuthInfo,
  verifyUser,
  updateOneAuthInfoLang,
  updateOneAuthInfoBio,
  updateOneAuthInfoPhone,
  updateOneAuthInfoProfession,
  updateOneAuthInfoContact,
  deleteOneAuth,
} from "../controller/authController";
import multer from "multer";
const upload = multer().single("avatar");

const router = Router();

router.route("/one-user/:userID").get(readOneAuth);

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
router.route("/all-user").get(readAllAuth);

router.route("/sign-user").post(signInUser);

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

router.route("/create-admin").post(createAdminAuth);
router.route("/create-artist").post(createArtistAuth);
router.route("/create-user").post(createUserAuth);
router.route("/verify-user").post(verifyUser);

router.route("/update-one-user/:userID").patch(upload, updateOneAuthAvatar);

router.route("/update-one-user-info/:userID").patch(updateOneAuthInfo);

router.route("/delete-user/:userID").delete(deleteOneAuth);

router.route("/update-one-user-lang/:userID").patch(updateOneAuthInfoLang);
router.route("/update-one-user-bio/:userID").patch(updateOneAuthInfoBio);
router
  .route("/update-one-user-contact/:userID")
  .patch(updateOneAuthInfoContact);
router
  .route("/update-one-user-profession/:userID")
  .patch(updateOneAuthInfoProfession);
router.route("/update-one-user-phone/:userID").patch(updateOneAuthInfoPhone);

export default router;
