import { PrismaClient } from '@prisma/client'
import {hash} from "bcryptjs";
const prisma = new PrismaClient()

async function main() {
    const adminPassword = await hash("admin123", 10);
    const userPassword = await hash("user123", 10);
    await prisma.user.createMany({
        data: [
            {
                name: "admin",
                email: "admin@gmail.com",
                password: adminPassword,
                role: "ADMIN"
            },
            {
                name: "user",
                email: "user@gmail.com",
                password: userPassword,
                role: "USER"
            }
        ]
    })

    const project = await prisma.project.create({
        data: {
          name: 'Initial Project',
          description: 'Create first project with Next.js.',
          ownerId: 8, // El ID del usuario administrador (ajústalo según sea necesario)
        },
      });
        
      // Crear una lista de tareas iniciales asociadas al proyecto
      const tasks = await prisma.task.createMany({
        data: [
          {
            title: 'Set up project repository',
            description: 'Initialize the project repository with basic structure and README.',
            status: 'COMPLETED',
            projectId: project.id,
            assigneeId: 7, // ID del usuario administrador
          },
          {
            title: 'Define requirements',
            description: 'Discuss and document the requirements of the project.',
            status: 'IN_PROGRESS',
            projectId: project.id,
            assigneeId: 8, // ID del usuario regular
          },
          {
            title: 'Develop initial features',
            description: 'Start developing the initial features of the application.',
            status: 'PENDING',
            projectId: project.id,
            assigneeId: 8,
          },
        ],
      });
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
