import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Users
  const users = await Promise.all(
    Array.from({ length: 5 }).map(async () =>
      prisma.user.create({
        data: {
          username: faker.internet.username(),
          email: faker.internet.email(),
          password: await hash('123456', 12),
          avatar: faker.image.avatar(),
        },
      }),
    ),
  );

  // 2. Seed Rooms
  const rooms = await Promise.all(
    users.map((user, index) =>
      prisma.room.create({
        data: {
          name: `Room ${index + 1}`,
          description: faker.lorem.sentence(),
          avatar: faker.image.avatar(),
          type: index % 2 === 0 ? 'PUBLIC' : 'PRIVATE',
          creatorId: user.id,
        },
      }),
    ),
  );

  // 3. Seed RoomMembers
  await Promise.all(
    rooms.flatMap((room) =>
      users.map((user, idx) =>
        prisma.roomMember.create({
          data: {
            userId: user.id,
            roomId: room.id,
            role: idx === 0 ? 'OWNER' : 'MEMBER',
            joinedAt: new Date(),
          },
        }),
      ),
    ),
  );

  console.log('✅ Seeded Users, Rooms, RoomMembers successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().catch(() => {});
  });
