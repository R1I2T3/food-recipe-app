-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('Veg', 'NonVeg');

-- CreateEnum
CREATE TYPE "FoodCusine" AS ENUM ('Thai', 'American', 'Chinese', 'Mexican', 'India', 'Nepali', 'Spanish');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL DEFAULT '',
    "gender" "Gender" NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "instruction" TEXT NOT NULL,
    "type" "FoodType" NOT NULL,
    "cusine" "FoodCusine" NOT NULL,
    "youtube_video_link" TEXT,
    "food_image_url" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ingredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" INTEGER NOT NULL,
    "recipeId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LikedRecipe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "date_liked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_id_key" ON "recipe"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_id_key" ON "ingredient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LikedRecipe_id_key" ON "LikedRecipe"("id");

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedRecipe" ADD CONSTRAINT "LikedRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedRecipe" ADD CONSTRAINT "LikedRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
