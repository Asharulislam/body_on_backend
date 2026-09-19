import { Request, Response } from 'express'
import { createMachine, deleteMachine, getMachineById, getMachines, updateMachine } from './machines.service'
import { createMachineSchema, updateMachineSchema } from './machines.validation'


export async function create(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId

    const parsed = createMachineSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: parsed.error.issues.map(i => i.message),
      })
    }

    const machine = await createMachine(ownerId, parsed.data)
    return res.status(201).json(machine)
  } catch (err: any) {
    if (err.message === 'GYM_NOT_FOUND') {
      return res.status(404).json({ error: 'no gym found' })
    }
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}

export async function list(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId
    const machines = await getMachines(ownerId)
    return res.status(200).json(machines)
  } catch (err: any) {
    if (err.message === 'GYM_NOT_FOUND') return res.status(404).json({ error: 'no gym found' })
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}

export async function update(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId
     const machineId = String(req.params.id)

    const parsed = updateMachineSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: parsed.error.issues.map(i => i.message),
      })
    }

    const machine = await updateMachine(ownerId, machineId, parsed.data)
    return res.status(200).json(machine)
  } catch (err: any) {
    if (err.message === 'GYM_NOT_FOUND') return res.status(404).json({ error: 'no gym found' })
    if (err.message === 'MACHINE_NOT_FOUND') return res.status(404).json({ error: 'machine not found' })
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId
    const machineId = String(req.params.id)
    const result = await deleteMachine(ownerId, machineId)
    return res.status(200).json(result)
  } catch (err: any) {
    if (err.message === 'GYM_NOT_FOUND') return res.status(404).json({ error: 'no gym found' })
    if (err.message === 'MACHINE_NOT_FOUND') return res.status(404).json({ error: 'machine not found' })
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const ownerId = req.user!.userId
    const machineId = String(req.params.id)
    const machine = await getMachineById(ownerId, machineId)
    return res.status(200).json(machine)
  } catch (err: any) {
    if (err.message === 'GYM_NOT_FOUND') return res.status(404).json({ error: 'no gym found' })
    if (err.message === 'MACHINE_NOT_FOUND') return res.status(404).json({ error: 'machine not found' })
    console.error(err)
    return res.status(500).json({ error: 'something went wrong' })
  }
}