import { type NextRequest, NextResponse } from "next/server";

const JUSTWATCH_API = "https://apis.justwatch.com/graphql";

const PACKAGES_QUERY = `
query GetPackages($country: Country!) {
  packages(country: $country, platform: WEB) {
    clearName
    packageId
    shortName
    icon
    monetizationTypes
  }
}`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get("country") || "US").toUpperCase();

  try {
    const res = await fetch(JUSTWATCH_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: PACKAGES_QUERY, variables: { country } }),
    });

    const json = await res.json();
    const packages = json.data?.packages || [];

    // Filter to only streaming (FLATRATE) platforms, sorted by name
    const streaming = packages
      .filter((p: Record<string, unknown>) =>
        (p.monetizationTypes as string[])?.includes("FLATRATE")
      )
      .map((p: Record<string, unknown>) => ({
        packageId: p.packageId,
        clearName: p.clearName,
        shortName: p.shortName,
        icon: p.icon ? `https://images.justwatch.com${p.icon}` : "",
      }))
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
        (a.clearName as string).localeCompare(b.clearName as string)
      );

    return NextResponse.json({ packages: streaming });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
