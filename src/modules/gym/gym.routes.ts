import { Router } from "express";
import { addImage, create, deleteImage, getImages, getMine, update } from "./gym.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "../../generated/prisma/enums";


const router = Router();

router.post("/", authenticate, authorize(Role.gym_owner), create);
router.get('/gymDetails', authenticate, authorize(Role.gym_owner), getMine)
router.patch('/gymDetails', authenticate, authorize(Role.gym_owner), update)

//images of gym
router.post('/addGymImage', authenticate, authorize(Role.gym_owner), addImage)
router.delete('/images/:id', authenticate, authorize(Role.gym_owner), deleteImage)
router.get('/images', authenticate, authorize(Role.gym_owner), getImages)
export default router;
