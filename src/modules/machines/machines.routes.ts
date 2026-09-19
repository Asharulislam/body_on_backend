import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "../../generated/prisma/enums.js";
import { create, getOne, list, remove, update } from "./machines.controller";

const router = Router();
router.post("/", authenticate, authorize(Role.gym_owner), create);
router.get("/", authenticate, authorize(Role.gym_owner), list);
router.patch("/:id", authenticate, authorize(Role.gym_owner), update);
router.delete("/:id", authenticate, authorize(Role.gym_owner), remove);
router.get("/:id", authenticate, authorize(Role.gym_owner), getOne);

export default router;
