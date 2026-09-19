import prisma from '../../core/config/prisma'
import { getViewUrl } from '../upload/upload.service'
import { CreateMachineInput, UpdateMachineInput } from './machines.validation'


export async function createMachine(ownerId: string, input: CreateMachineInput) {
  const gym = await prisma.gym.findUnique({ where: { ownerId } })
  if (!gym) throw new Error('GYM_NOT_FOUND')

  return prisma.machine.create({
    data: { ...input, gymId: gym.id },
  })
}

export async function getMachines(ownerId: string) {
  const gym = await prisma.gym.findUnique({ where: { ownerId } })
  if (!gym) throw new Error('GYM_NOT_FOUND')

  const machines = await prisma.machine.findMany({
    where: { gymId: gym.id },
    orderBy: { createdAt: 'desc' },
  })

  return Promise.all(
    machines.map(async (m) => ({
      id: m.id,
      machineName: m.machineName,
      description: m.description,
      imageUrl: m.imageKey ? await getViewUrl(m.imageKey) : null,
    }))
  )
}

export async function updateMachine(ownerId: string, machineId: string, input: UpdateMachineInput) {
  const gym = await prisma.gym.findUnique({ where: { ownerId } })
  if (!gym) throw new Error('GYM_NOT_FOUND')

  const machine = await prisma.machine.findUnique({ where: { id: machineId } })
  if (!machine || machine.gymId !== gym.id) throw new Error('MACHINE_NOT_FOUND')

  return prisma.machine.update({
    where: { id: machineId },
    data: input,
  })
}

export async function deleteMachine(ownerId: string, machineId: string) {
  const gym = await prisma.gym.findUnique({ where: { ownerId } })
  if (!gym) throw new Error('GYM_NOT_FOUND')

  const machine = await prisma.machine.findUnique({ where: { id: machineId } })
  if (!machine || machine.gymId !== gym.id) throw new Error('MACHINE_NOT_FOUND')

  await prisma.machine.delete({ where: { id: machineId } })
  return { success: true }
}

export async function getMachineById(ownerId: string, machineId: string) {
  const gym = await prisma.gym.findUnique({ where: { ownerId } })
  if (!gym) throw new Error('GYM_NOT_FOUND')

  const machine = await prisma.machine.findUnique({ where: { id: machineId } })
  if (!machine || machine.gymId !== gym.id) throw new Error('MACHINE_NOT_FOUND')

  return {
    id: machine.id,
    machineName: machine.machineName,
    description: machine.description,
    imageUrl: machine.imageKey ? await getViewUrl(machine.imageKey) : null,
  }
}