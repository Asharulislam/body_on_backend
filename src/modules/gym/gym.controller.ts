import { Request, Response } from "express";
import { addGymImage, createGym, deleteGymImage, getGymImages, getMyGym, updateGym } from "./gym.service";
import { addGymImageSchema, createGymSchema, updateGymSchema } from "./gym.validation";

export async function create(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId;

    const parsed = createGymSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "validation failed",
        details: parsed.error.issues.map((i) => i.message),
      });
    }

    const gym = await createGym(ownerId, parsed.data);
    return res.status(201).json(gym);
  } catch (err: any) {
    if (err.message === "GYM_ALREADY_EXISTS") {
      return res.status(409).json({ error: "you already have a gym" });
    }
    console.error(err);
    return res.status(500).json({ error: "something went wrong" });
  }
}

export async function getMine(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId;
    const gym = await getMyGym(ownerId);
    return res.status(200).json(gym);
  } catch (err: any) {
    if (err.message === "GYM_NOT_FOUND") {
      return res.status(404).json({ error: "no gym found" });
    }
    console.error(err);
    return res.status(500).json({ error: "something went wrong" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId;

    const parsed = updateGymSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "validation failed",
        details: parsed.error.issues.map((i) => i.message),
      });
    }

    const gym = await updateGym(ownerId, parsed.data);
    return res.status(200).json(gym);
  } catch (err: any) {
    if (err.message === "GYM_NOT_FOUND") {
      return res.status(404).json({ error: "no gym found" });
    }
    console.error(err);
    return res.status(500).json({ error: "something went wrong" });
  }
}


//images of gym

export async function addImage(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId

    const parsed = addGymImageSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: parsed.error.issues.map(i => i.message),
      })
    }

    const image = await addGymImage(ownerId, parsed.data.key)
    return res.status(201).json(image)
  } catch (err: any) {
    if (err.message === 'GYM_NOT_FOUND') {
      return res.status(404).json({ error: 'no gym found' })
    }
    if (err.message === 'IMAGE_LIMIT_REACHED') {
      return res.status(409).json({ error: 'maximum 10 images allowed' })
    }
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}

export async function deleteImage(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId
    const imageId = String(req.params.id)

    const result = await deleteGymImage(ownerId, imageId)
    return res.status(200).json(result)
  } catch (err: any) {
    if (err.message === 'GYM_NOT_FOUND') {
      return res.status(404).json({ error: 'no gym found' })
    }
    if (err.message === 'IMAGE_NOT_FOUND') {
      return res.status(404).json({ error: 'image not found' })
    }
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}

export async function getImages(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId
    const images = await getGymImages(ownerId)
    return res.status(200).json(images)
  } catch (err: any) {
    if (err.message === 'GYM_NOT_FOUND') {
      return res.status(404).json({ error: 'no gym found' })
    }
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}