export function evaluateAudit(report, exceptions, packages, today = new Date().toISOString().slice(0, 10)) {
  if (report.error || !report.vulnerabilities || !report.metadata?.vulnerabilities) throw new Error("A complete npm audit report is required.");
  const failures = [], accepted = [], seen = new Set();
  const hasAdvisory = (name, visited = new Set()) => {
    if (visited.has(name)) return false;
    visited.add(name);
    return report.vulnerabilities[name]?.via.some(item => typeof item === "object" || hasAdvisory(item, visited));
  };
  for (const vulnerability of Object.values(report.vulnerabilities)) {
    if (!hasAdvisory(vulnerability.name)) failures.push(`${vulnerability.name}: audit dependency chain has no identifiable advisory`);
    if (["high", "critical"].includes(vulnerability.severity)) failures.push(`${vulnerability.name}: ${vulnerability.severity} severity`);
    for (const advisory of vulnerability.via.filter(item => typeof item === "object")) {
      for (const path of vulnerability.nodes) {
        const version = packages[path]?.version;
        const key = `${advisory.url}:${path}:${version}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const exception = exceptions.find(item => item.advisory === advisory.url && item.package === vulnerability.name && item.version === version && item.paths.includes(path) && item.expires >= today && item.reason && item.evidence && Object.entries(item.context || {}).every(([parent, expected]) => packages[parent]?.version === expected));
        if (advisory.severity === "moderate" && exception) accepted.push({ package: vulnerability.name, path, version, advisory: advisory.url, expires: exception.expires });
        else failures.push(`${vulnerability.name}@${version || "unknown"}: ${advisory.severity} ${advisory.url} (${path})`);
      }
    }
  }
  if (report.metadata.vulnerabilities.total > 0 && seen.size === 0) failures.push("The audit reported findings without identifiable advisories.");
  return { failures: [...new Set(failures)], accepted };
}
