import dayjs from 'dayjs'
import { client, db } from '.'
import { goalCcmpletions, goals } from './schema'

async function seed() {
  await db.delete(goalCcmpletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { title: 'Me exercitar', desiredWeeklyFrequency: 3 },
      { title: 'Meditar', desiredWeeklyFrequency: 1 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCcmpletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[0].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
