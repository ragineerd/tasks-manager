import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const allFields = [
    // Campos de Tareas 
    { formType: 'TASK_DASHBOARD', fieldName: 'title', label: 'Título de la tarea', type: 'text', isRequired: true },
    { formType: 'TASK_DASHBOARD', fieldName: 'dueDate', label: 'Fecha Límite', type: 'datetime-local', isRequired: false },
    { formType: 'TASK_DASHBOARD', fieldName: 'description', label: 'Descripción', type: 'textarea', isRequired: false },
    
    // Campos de Registro 
    { formType: 'REGISTER', fieldName: 'name', label: 'Nombre Completo', type: 'text', isRequired: true },
    { formType: 'REGISTER', fieldName: 'email', label: 'Correo Electrónico', type: 'text', isRequired: true },
    { formType: 'REGISTER', fieldName: 'password', label: 'Contraseña', type: 'text', isRequired: true },
  ]

  console.log('🌱 Sembrando datos en la base de datos...')

  for (const field of allFields) {
    await prisma.formField.upsert({
      where: {
        formType_fieldName: {
          formType: field.formType,
          fieldName: field.fieldName,
        },
      },
      update: {},
      create: {
        ...field,
        isActive: true,
        order: 0,
      },
    })
  }

  console.log('✅ Sincronización completada.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })