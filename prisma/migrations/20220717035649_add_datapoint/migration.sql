-- CreateTable
CREATE TABLE "DataPoint" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "device" TEXT NOT NULL,

    CONSTRAINT "DataPoint_pkey" PRIMARY KEY ("id")
);
