import { authorize } from "@/lib/basic-auth";
import { prismaClient } from "@/prisma/prisma-client";
import { subDays } from "date-fns";

// this /seed/insert POST route is used to insert dummy data into the database
/**
 Example request:
 curl -X POST 'http://localhost:3000/seed/insert' --header "Authorization: Basic $(echo -n 'username:password' | base64)"

 Replace username and password with the value of BASIC_AUTH_USER and BASIC_AUTH_PASSWORD in your .env file.
 */
export const POST = async (request: Request) => {
  // simple basic authentication
  const authResult = authorize();
  if (authResult) return authResult;

  let humanLabelFromDate: Date | undefined;

  try {
    const formData = await request.formData();
    const humanLabelFromDateFromForm = formData
      ?.get("humanLabelFromDate")
      ?.toString();
    humanLabelFromDate = humanLabelFromDateFromForm
      ? new Date(humanLabelFromDateFromForm)
      : undefined;
  } catch (error) {}

  // create dummy author
  await prismaClient.user.createMany({
    data: [...Array(10).keys()].map((i) => {
      return {
        name: `user_${i}`,
        email: `user_${i}@example.com`,
        password: `user_${i}`,
      };
    }),
    skipDuplicates: true,
  });
  const usersInDb = await prismaClient.user.findMany();

  // create dummy label sets
  const labelSetCount = await prismaClient.labelSet.count();
  let labelSets: any = [];
  if (labelSetCount === 0) {
    labelSets = [...Array(10).keys()].map((i) => {
      return {
        name: `label_set_${i + 1}`,
      };
    });
  }

  const labelSetClassCount = await prismaClient.labelSetClass.count();
  let labelSetClasses: any = [];
  if (labelSetClassCount === 0) {
    labelSetClasses = [...Array(10).keys()].map((i) => {
      return {
        name: `label_set_class_${i + 1}`,
      };
    });
  }

  // save label sets and label set classes to database
  if (labelSets.length > 0) {
    await prismaClient.labelSet.createMany({
      data: labelSets,
    });
  }

  if (labelSetClasses.length > 0) {
    await prismaClient.labelSetClass.createMany({
      data: labelSetClasses,
    });
  }

  // get all label sets and label set classes from database
  const [labelSetsInDb, labelSetClassesInDb] = await Promise.all([
    prismaClient.labelSet.findMany(),
    prismaClient.labelSetClass.findMany(),
  ]);

  // create dummy categories
  const categories: { labelSetId: number; labelSetClassId: number }[] = [];
  for (const labelSet of labelSetsInDb) {
    for (const labelSetClass of labelSetClassesInDb) {
      categories.push({
        labelSetId: labelSet.id,
        labelSetClassId: labelSetClass.id,
      });
    }
  }
  // save categories to database
  await prismaClient.category.createMany({
    data: categories,
    skipDuplicates: true,
  });
  const categoriesInDb = await prismaClient.category.findMany();

  const lastBale = await prismaClient.bale.findFirst({
    orderBy: {
      id: "desc",
    },
  });
  const balseStartId = lastBale?.id ?? 0;
  const oldestBale = await prismaClient.bale.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });
  const olderBaleDate = oldestBale?.createdAt ?? new Date();

  const bales = [...Array(100).keys()].map((i) => {
    return {
      id: balseStartId + i + 1,
      url: `https://picsum.photos/id/${i}/200/300`,
      createdAt: subDays(olderBaleDate, i + 1),
      updatedAt: subDays(olderBaleDate, i + 1),
    };
  });

  await prismaClient.bale.createMany({
    data: bales,
  });
  const balesInDb = await prismaClient.bale.findMany();

  const lastPrediction = await prismaClient.modelPrediction.findFirst({
    orderBy: {
      id: "desc",
    },
  });
  const predictionStartId = lastPrediction?.id ?? 0;
  const predictions = [...Array(100).keys()].map((i) => {
    return {
      id: predictionStartId + i + 1,
      baleId: getRandomElement(balesInDb).id,
      categoryId: getRandomElement(categoriesInDb).id,
      confidence: Math.random(),
    };
  });

  await prismaClient.modelPrediction.createMany({
    data: predictions,
  });

  const lastHumanLabel = await prismaClient.humanLabels.findFirst({
    orderBy: {
      id: "desc",
    },
  });
  const humanLabelStartId = lastHumanLabel?.id ?? 0;
  const oldestHumanLabel = await prismaClient.humanLabels.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });
  const olderHumanLabelDate =
    humanLabelFromDate ?? oldestHumanLabel?.createdAt ?? new Date();
  const humanLabels = [...Array(20).keys()].map((i) => {
    return {
      id: humanLabelStartId + i + 1,
      categoryId: getRandomElement(categoriesInDb).id,
      baleId: getRandomElement(balesInDb).id,
      authorId: getRandomElement(usersInDb).id,
      createdAt: subDays(olderHumanLabelDate, i + 1),
      updatedAt: subDays(olderHumanLabelDate, i + 1),
    };
  });

  await prismaClient.humanLabels.createMany({
    data: humanLabels,
  });

  return Response.json({ message: "success" });
};

export const DELETE = async (_request: Request) => {
  await prismaClient.user.deleteMany();
  await prismaClient.labelSet.deleteMany();
  await prismaClient.labelSetClass.deleteMany();
  await prismaClient.category.deleteMany();
  await prismaClient.bale.deleteMany();
  await prismaClient.modelPrediction.deleteMany();
  await prismaClient.humanLabels.deleteMany();

  return Response.json({ message: "success" });
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
