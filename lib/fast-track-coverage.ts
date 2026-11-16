import type { FastTrackPackage } from "./types";
export function cairoFastTrackPackages(packages: FastTrackPackage[]): FastTrackPackage[] {
  const allowed = /^(?:all airports|all egyptian airports|cairo|cairo airport|cairo international airport|cai|كل المطارات|جميع المطارات|كل المطارات المصرية|جميع المطارات المصرية|القاهرة|مطار القاهرة|القاهرة الدولي|مطار القاهرة الدولي)$/i;
  return packages.filter(item => {
    const labels = [item.airport, item.translations?.ar?.airport, item.translations?.en?.airport].filter((value): value is string => typeof value === "string" && !!value.trim());
    return labels.length > 0 && labels.every(value => allowed.test(value.trim()));
  });
}
