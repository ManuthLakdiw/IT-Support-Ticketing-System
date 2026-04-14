import { PrismaClient, Role, TicketStatus } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 12;


const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "ticketing_db",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter } as any);


async function main() {
  console.log("Starting database seed...\n");

  const adminPassword = await bcrypt.hash("Admin1234!", SALT_ROUNDS);
  const admin = await prisma.user.upsert({
    where: { email: "admin@support.com" },
    update: {},
    create: {
      email: "admin@support.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`Admin user:   ${admin.email}  (role: ${admin.role})`);

  const userPassword = await bcrypt.hash("User1234!", SALT_ROUNDS);
  const user = await prisma.user.upsert({
    where: { email: "user@support.com" },
    update: {},
    create: {
      email: "user@support.com",
      password: userPassword,
      role: Role.USER,
    },
  });
  console.log(`Regular user: ${user.email}  (role: ${user.role})`);

  const ticketDefs = [
    {
      title: "Cannot access VPN from home network",
      description:
        "Since working remotely I'm unable to connect to the company VPN. The client shows a timeout error every time I try. Tried restarting router and reinstalling the client.",
      status: TicketStatus.OPEN,
    },
    {
      title: "Email client keeps crashing on startup",
      description:
        "Outlook crashes immediately after the splash screen. Error log shows 0xc0000005. Tried repairing Office but the issue persists after restart.",
      status: TicketStatus.IN_PROGRESS,
    },
    {
      title: "Network printer not recognised after Windows update",
      description:
        "After applying KB5034441 our shared printer HP LaserJet Pro 400 is no longer visible in the network. Other colleagues on the same floor have the same issue.",
      status: TicketStatus.OPEN,
    },
    {
      title: "Password reset needed — locked out of company portal",
      description:
        "I mistakenly entered the wrong password too many times and my account is now locked. Need an admin reset so I can access the HR portal.",
      status: TicketStatus.RESOLVED,
    },
    {
      title: "Slow performance on shared drive (\\\\fileserver\\shared)",
      description:
        "The shared drive has been very slow since Monday. Files take 30+ seconds to open. The issue affects our whole team. Local disk performance is fine.",
      status: TicketStatus.IN_PROGRESS,
    },
  ];

  let created = 0;
  for (const def of ticketDefs) {
    const existing = await prisma.ticket.findFirst({
      where: { title: def.title, createdById: user.id },
    });
    if (!existing) {
      await prisma.ticket.create({
        data: { ...def, createdById: user.id },
      });
      created++;
    }
  }
  console.log(`\n  Sample tickets seeded: ${created} new (${ticketDefs.length - created} already existed)`);

  console.log("\n  Seed complete!\n");
  console.log("   Admin login :  admin@support.com  /  Admin1234!");
  console.log("   User login  :  user@support.com   /  User1234!\n");
}

main()
  .catch((e) => {
    console.error("  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
