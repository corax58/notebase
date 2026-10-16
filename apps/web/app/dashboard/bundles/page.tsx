import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { BundlesView } from "@/components/bundles-view";
import { getBundles } from "@/lib/queries/bundles";

export default async function BundlesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const rows = await getBundles(userId);

  return <BundlesView bundles={rows} />;
}
