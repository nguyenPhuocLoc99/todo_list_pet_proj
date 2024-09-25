import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const defaultUserRecord = await prisma.user.findUnique({
    where: {
      loginName: 'admin',
    },
  });

  if (!defaultUserRecord) {
    await prisma.user.create({
      data: {
        loginName: 'admin',
        hash: await argon.hash('123'),
        name: 'LocNP',
        isAdmin: true,
      },
    });
    console.log(
      '\n-----\nDefault admin user created\nLogin name: admin\nPassword: 123\n-----',
    );
  } else {
    console.log(
      'Default admin user is already exist. Please check database for more detail.',
    );
  }

  // const allPermissions = [
  //   'allowInProgress',
  //   'allowReview',
  //   'allowDone',
  //   'allowCancel',
  //   'allowReassignTask',
  //   'allowUpdateTaskAccess',
  //   'allowUpdateGroupAccess',
  //   'allowUpdateTaskInfo',
  //   'allowUpdateGroupInfo',
  // ];
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
