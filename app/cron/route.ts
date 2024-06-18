import { prismaClient } from "@/prisma/prisma-client";
import { authorize } from "../../lib/basic-auth";
import { getPredefinedTimeRanges } from "../summary/time-range";
import { createOrRefreshMaterializedView } from "../summary/api/materialized-view/create-materialized-view";

// this /cron route is used to create or refresh materialized views based on the existing label sets
// it should be called periodically to keep the data up to date, say every day
/*
Example request:
curl  -X POST 'http://localhost:3000/cron' --header 'Authorization: Basic $(echo -n 'username:password' | base64)'

Replace username and password with the value of BASIC_AUTH_USER and BASIC_AUTH_PASSWORD in your .env file.
*/
export const POST = async (_req: Request) => {
  // simple basic authentication
  const authResult = authorize();
  if (authResult) return authResult;

  const labelSets = await prismaClient.labelSet.findMany({
    select: {
      id: true,
    },
  });

  const materializedViewMetadata = [];

  if (labelSets.length > 0) {
    const timeRange = getPredefinedTimeRanges();
    for (const labelSetId of labelSets) {
      for (const [, start, end] of timeRange) {
        materializedViewMetadata.push({
          labelSetId: labelSetId.id,
          from: start,
          to: end,
        });
      }
    }
  }

  // in production, it's better to use queue instead of waiting for the createOrRefreshMaterializedView functions to finish.
  // for example, we can use trigger.dev or inngest.
  await Promise.all(
    materializedViewMetadata.map((m) => {
      return createOrRefreshMaterializedView(m.labelSetId, m.from, m.to);
    })
  );

  return Response.json({ message: "ok" });
};
