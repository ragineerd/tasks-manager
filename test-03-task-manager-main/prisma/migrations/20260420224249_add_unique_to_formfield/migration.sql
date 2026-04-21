/*
  Warnings:

  - A unique constraint covering the columns `[formType,fieldName]` on the table `FormField` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FormField_formType_fieldName_key" ON "FormField"("formType", "fieldName");
