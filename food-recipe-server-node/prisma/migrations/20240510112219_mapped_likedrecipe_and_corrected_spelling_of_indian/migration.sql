/*
  Warnings:

  - The values [India] on the enum `FoodCuisine` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `LikedRecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FoodCuisine_new" AS ENUM ('Thai', 'American', 'Chinese', 'Mexican', 'Indian', 'Nepali', 'Spanish');
ALTER TABLE "recipe" ALTER COLUMN "cuisine" TYPE "FoodCuisine_new" USING ("cuisine"::text::"FoodCuisine_new");
ALTER TYPE "FoodCuisine" RENAME TO "FoodCuisine_old";
ALTER TYPE "FoodCuisine_new" RENAME TO "FoodCuisine";
DROP TYPE "FoodCuisine_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "LikedRecipe" DROP CONSTRAINT "LikedRecipe_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "LikedRecipe" DROP CONSTRAINT "LikedRecipe_userId_fkey";

-- DropTable
DROP TABLE "LikedRecipe";

-- CreateTable
CREATE TABLE "likedrecipe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "date_liked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "likedrecipe_id_key" ON "likedrecipe"("id");

-- AddForeignKey
ALTER TABLE "likedrecipe" ADD CONSTRAINT "likedrecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likedrecipe" ADD CONSTRAINT "likedrecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
