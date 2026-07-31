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

function jwIcon(icon: string): string {
  if (!icon) {
    return "";
  }
  return `https://images.justwatch.com${icon.replace("{profile}", "s100").replace("{format}", "webp")}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get("country") || "US").toUpperCase();

  try {
    const res = await fetch(JUSTWATCH_API, {
      body: JSON.stringify({ query: PACKAGES_QUERY, variables: { country } }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const json = await res.json();
    const packages = json.data?.packages || [];

    const mapped = packages
      .map((p: Record<string, unknown>) => ({
        clearName: p.clearName,
        icon: jwIcon(p.icon as string),
        monetizationTypes: p.monetizationTypes || [],
        packageId: p.packageId,
        shortName: p.shortName,
      }))
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
        (a.clearName as string).localeCompare(b.clearName as string)
      );

    // Also return only streaming (FLATRATE) for backward compatibility
    const streaming = mapped.filter((p: Record<string, unknown>) =>
      (p.monetizationTypes as string[]).includes("FLATRATE")
    );

    return NextResponse.json(
      { allPackages: mapped, packages: streaming },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
