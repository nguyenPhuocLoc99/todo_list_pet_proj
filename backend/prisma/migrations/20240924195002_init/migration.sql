-- CreateEnum
CREATE TYPE "Status" AS ENUM ('toDo', 'inProgress', 'review', 'done', 'cancelled');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('allowInProgress', 'allowReview', 'allowDone', 'allowCancel', 'allowReassignTask', 'read', 'updateAccess', 'updateInfo', 'delete');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "loginName" VARCHAR(30) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "hash" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "email" VARCHAR(50),
    "phone" VARCHAR(10),
    "otherContacts" VARCHAR(50),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'toDo',
    "taskName" VARCHAR NOT NULL,
    "description" VARCHAR(500),
    "estimation" TIME,
    "startTime" TIMESTAMP,
    "dueTime" TIMESTAMP,
    "groupId" INTEGER,
    "assigneeId" INTEGER,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taskgroups" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "groupName" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500),

    CONSTRAINT "taskgroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userprofiles" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "cvPath" VARCHAR(100) NOT NULL,
    "salary" INTEGER NOT NULL,
    "onboardDate" DATE DEFAULT CURRENT_TIMESTAMP,
    "division" VARCHAR(50),
    "contractPath" VARCHAR(100),
    "remainingLeaves" DOUBLE PRECISION,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "benefits" INTEGER,

    CONSTRAINT "userprofiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logwork" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "timeSpent" TIME NOT NULL,
    "description" VARCHAR(300),
    "date" TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "logwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accesscontrol" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "taskId" INTEGER,
    "groupId" INTEGER,
    "permission" "Permission"[],

    CONSTRAINT "accesscontrol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_loginName_key" ON "users"("loginName");

-- CreateIndex
CREATE UNIQUE INDEX "userprofiles_userId_key" ON "userprofiles"("userId");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "taskgroups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userprofiles" ADD CONSTRAINT "userprofiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logwork" ADD CONSTRAINT "logwork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logwork" ADD CONSTRAINT "logwork_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesscontrol" ADD CONSTRAINT "accesscontrol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesscontrol" ADD CONSTRAINT "accesscontrol_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesscontrol" ADD CONSTRAINT "accesscontrol_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "taskgroups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
