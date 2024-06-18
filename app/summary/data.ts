import { prismaClient } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";

export const getSummaryForLabelSet = async (
  labelSetId: number,
  from: Date,
  to: Date
) => {
  const humanLabels = await prismaClient.humanLabels.findMany({
    where: {
      category: {
        labelSetId,
      },
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        include: {
          labelSet: true,
          labelSetClass: true,
        },
      },
    },
  });

  const grouped = humanLabels.reduce((acc, label) => {
    const existing = acc.find(
      (l) => l.labelSetClassId === label.category.labelSetClassId
    );
    if (existing) {
      existing._count += 1;
    } else {
      acc.push({
        labelSetClassId: label.category.labelSetClass.id,
        labelSetClassName: label.category.labelSetClass.name,
        _count: 1,
      });
    }
    return acc;
  }, [] as { labelSetClassId: number; labelSetClassName: string; _count: number }[]);

  return grouped;
};

export const getSummaryForLabelSetFromMaterializedView = async (
  labelSetId: number,
  from: Date,
  to: Date
) => {
  // TODO: get data from materialized view
};

// this function is exactly the same as getSummaryForLabelSet, but it uses the raw query instead of the prisma client
export const getSummaryForLabelSetRaw = async (
  labelSetId: number,
  from: Date,
  to: Date
) => {
  const humanLabels = await prismaClient.$queryRaw<
    { labelSetClassId: number; labelSetClassName: string; _count: number }[]
  >(Prisma.sql`
      SELECT 
        c."labelSetClassId" as "labelSetClassId",
        lc.name as "labelSetClassName",
        COUNT(*)::int as "_count"
      FROM 
        "human_labels" hl
      JOIN 
        "categories" c ON hl."categoryId" = c.id
      JOIN 
        "label_set_classes" lc ON c."labelSetClassId" = lc.id
      WHERE 
        c."labelSetId" = ${labelSetId} 
        AND hl."createdAt" BETWEEN ${from} AND ${to}
      GROUP BY 
        c."labelSetClassId", lc.name
      ORDER BY 
        MAX(hl."createdAt") DESC;
    `);

  return humanLabels;
};
