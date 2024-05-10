/*
  Warnings:

  - You are about to drop the column `cusine` on the `recipe` table. All the data in the column will be lost.
  - Added the required column `cuisine` to the `recipe` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FoodCuisine" AS ENUM ('Thai', 'American', 'Chinese', 'Mexican', 'India', 'Nepali', 'Spanish');

-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "cusine",
ADD COLUMN     "cuisine" "FoodCuisine" NOT NULL;

-- DropEnum
DROP TYPE "FoodCusine";
