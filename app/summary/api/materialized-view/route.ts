import { authorize } from "@/lib/basic-auth";
import { createOrRefreshMaterializedView } from "./create-materialized-view";

/**
 * This /api/materialized-view route is used to create or refresh materialized views based on the given label set id and time range
 * @param request
 * @returns
 */
export const POST = async (request: Request) => {
  // simple basic authentication
  const authResult = authorize();
  if (authResult) return authResult;

  const { labelSetId, from, to } = await request.json();

  await createOrRefreshMaterializedView(
    labelSetId,
    new Date(from),
    new Date(to)
  );

  return new Response(null, {
    status: 200,
  });
};
