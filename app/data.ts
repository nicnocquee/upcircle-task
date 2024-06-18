import { prismaClient } from "@/prisma/prisma-client";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

export const getHumanLabels = async (
  from: Date,
  to: Date,
  limit = 100,
  skip = 0
) => {
  return Promise.all([
    prismaClient.humanLabels.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        bale: true,
        category: {
          include: {
            labelSet: true,
            labelSetClass: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip,
    }),
    prismaClient.humanLabels.count({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    }),
  ]);
};

export const getHumanLabelsToday = async (limit = 100, skip = 0) => {
  return getHumanLabels(
    startOfDay(new Date()),
    endOfDay(new Date()),
    limit,
    skip
  );
};

export const getHumanLabelsThisWeek = async (limit = 100, skip = 0) => {
  return getHumanLabels(
    startOfWeek(new Date()),
    endOfWeek(new Date()),
    limit,
    skip
  );
};

export const getHumanLabelsThisMonth = async (limit = 100, skip = 0) => {
  return getHumanLabels(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
    limit,
    skip
  );
};

export const getHumanLabelsThisYear = async (limit = 100, skip = 0) => {
  return getHumanLabels(
    startOfYear(new Date()),
    endOfYear(new Date()),
    limit,
    skip
  );
};
