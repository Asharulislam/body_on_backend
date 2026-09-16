import { Router } from "express";
import { create } from "./gym.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/", authenticate, authorize(Role.gym_owner), create);
// router.get('/gymDetails', authenticate, authorize('gym_owner'), getMine)
// router.patch('/gymDetails', authenticate, authorize('gym_owner'), update)

export default router;
