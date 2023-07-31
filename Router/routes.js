import { Router } from "express";
import * as controller from '../controller/controller.js'
const router = Router();

router.route('/signup').post(controller.Signup);

router.route('/login').post(controller.Login);

router.route('/additem').post(controller.additem);

router.route('/deleteCard').post(controller.deleteCard);

router.route('/changerating').post(controller.changerating);

router.route('/SendUserData').post(controller.SendUserData);

router.route('/changelevel').post(controller.changelevel);

export default router;