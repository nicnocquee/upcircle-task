import { prismaClient } from "@/prisma/prisma-client";

export const createOrRefreshMaterializedView = async (
  labelSetId: number,
  from: Date,
  to: Date
) => {
  const fromDate = from.toISOString();
  const toDate = to.toISOString();

  // Generate a unique name for the materialized view
  const viewName = `mv_summary_labelset_${labelSetId}_${fromDate
    .split("T")[0]
    .replace(/-/g, "")}_${toDate.split("T")[0].replace(/-/g, "")}`;

  // Check if the materialized view already exists
  const viewExists = await prismaClient.$queryRaw`
        SELECT EXISTS (
          SELECT 1
          FROM pg_matviews 
          WHERE matviewname = ${viewName}
        );
      `;

  // Prepare the SQL query for creating the materialized view
  const createMaterializedViewSQL = `
        CREATE MATERIALIZED VIEW ${viewName} AS
        SELECT 
            c."labelSetClassId" AS "labelSetClassId",
            lc.name AS "labelSetClassName",
            COUNT(*)::int AS "_count",
            MAX(hl."createdAt") AS "createdAt",
            c."labelSetId" AS "labelSetId"
        FROM 
            "human_labels" hl
        JOIN 
            "categories" c ON hl."categoryId" = c.id
        JOIN 
            "label_set_classes" lc ON c."labelSetClassId" = lc.id
        WHERE 
            c."labelSetId" = ${labelSetId}
            AND hl."createdAt" >= ${`'${fromDate}'`}
            AND hl."createdAt" < ${`'${toDate}'`}
        GROUP BY 
            c."labelSetClassId", lc.name, c."labelSetId"
        ORDER BY 
            MAX(hl."createdAt") DESC;
      `;

  if (!((viewExists as any)[0] as any).exists) {
    // Create the materialized view if it does not exist
    await prismaClient.$executeRawUnsafe(createMaterializedViewSQL);
    console.log(`Materialized view ${viewName} created successfully.`);
  } else {
    // Refresh the materialized view if it exists
    await prismaClient.$executeRawUnsafe(
      `REFRESH MATERIALIZED VIEW ${viewName};`
    );
    console.log(`Materialized view ${viewName} refreshed successfully.`);
  }
};
