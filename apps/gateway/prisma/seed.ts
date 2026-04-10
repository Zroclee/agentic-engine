import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // 1. Create or update the Super Admin role
  const superAdminRole = await prisma.role.upsert({
    where: { roleCode: 'SUPER_ADMIN' },
    update: {},
    create: {
      roleCode: 'SUPER_ADMIN',
      roleName: '超级管理员',
      description: '系统最高权限管理员',
      status: 1,
    },
  });
  console.log(`Role created/updated: ${superAdminRole.roleName}`);

  // 2. Create or update the default admin user
  const adminUsername = 'admin';
  const defaultPassword = '123456'; // You can change this

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(defaultPassword, salt);

  const adminUser = await prisma.user.upsert({
    where: { username: adminUsername },
    update: {
      password: hashedPassword,
    },
    create: {
      username: adminUsername,
      password: hashedPassword,
      isActive: true,
    },
  });
  console.log(`User created/updated: ${adminUser.username}`);

  // 3. Assign the Super Admin role to the admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: superAdminRole.id,
    },
  });
  console.log(
    `Role ${superAdminRole.roleName} assigned to ${adminUser.username}`,
  );

  console.log('Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
