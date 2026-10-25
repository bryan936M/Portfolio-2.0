import { getCliClient } from "sanity/cli";

const projectId = "i5u4ixfm";
const hookName = "Bryan portfolio — Vercel main";
const previousHookName = "Bryan portfolio — Vercel review";
const client = getCliClient({ apiVersion: "2025-08-04" });
if (
  client.config().projectId !== projectId ||
  client.config().dataset !== "production"
)
  throw new Error(
    "Publishing is restricted to the selected portfolio dataset.",
  );
const management = client.withConfig({ useProjectHostname: false });
const path = `/hooks/projects/${projectId}`;
const mode = process.env.PORTFOLIO_PUBLISHING_ACTION || "status";
let secretUrl = "";

async function readHiddenInput() {
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stderr.write(
    "Ready for publishing JSON on stdin (input is hidden).\n",
  );
  return new Promise((resolve, reject) => {
    let input = "";
    const finish = (error) => {
      process.stdin.off("data", onData);
      process.stdin.off("end", onEnd);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      process.stdin.pause();
      if (error) reject(error);
      else {
        try {
          resolve(JSON.parse(input));
        } catch {
          reject(new Error("Provide one valid JSON object."));
        }
      }
    };
    const onData = (chunk) => {
      input += chunk;
      if (input.includes("\u0003")) finish(new Error("Cancelled"));
      else if (input.length > 16000) finish(new Error("Input too large"));
      else if (input.includes("\n")) finish();
    };
    const onEnd = () => finish();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", onData);
    process.stdin.once("end", onEnd);
    process.stdin.resume();
  });
}

try {
  const response = await management.request({ url: path });
  const hooks = Array.isArray(response) ? response : response.hooks;
  const existing =
    hooks.find((hook) => hook.name === hookName) ||
    hooks.find((hook) => hook.name === previousHookName);
  if (mode === "configure") {
    const input = await readHiddenInput();
    secretUrl = input.deployHookUrl;
    const url = new URL(secretUrl);
    if (
      url.origin !== "https://api.vercel.com" ||
      !/^\/v1\/integrations\/deploy\/prj_wGVGY5bTKpkwiHBSty9niAtv1SiT\/[A-Za-z0-9_-]+$/.test(
        url.pathname,
      ) ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    )
      throw new Error("Use this portfolio's Vercel deploy hook.");
    const body = {
      ...(existing ? {} : { type: "document" }),
      name: hookName,
      description:
        "Rebuild the protected main website after published portfolio changes.",
      url: secretUrl,
      dataset: "production",
      rule: {
        on: ["create", "update", "delete"],
        filter:
          'coalesce(after()._type, before()._type) in ["portfolioProfile", "portfolioProject", "portfolioExperiment"]',
        projection:
          '{"documentId": coalesce(after()._id, before()._id), "operation": delta::operation()}',
      },
      apiVersion: "v2025-02-19",
      httpMethod: "POST",
      includeDrafts: false,
      includeAllVersions: false,
      isDisabledByUser: false,
    };
    const hook = await management.request({
      url: existing ? `${path}/${existing.id}` : path,
      method: existing ? "PATCH" : "POST",
      body,
    });
    console.log(
      JSON.stringify({
        configured: true,
        id: hook.id,
        name: hook.name,
        drafts: false,
      }),
    );
  } else if (mode === "test") {
    if (!existing) throw new Error("Configure the publishing webhook first.");
    const doc = await client.getDocument("portfolio-project-umucyo-catalog-ai");
    if (!doc || !/^#[0-9a-f]{6}$/i.test(doc.color))
      throw new Error("Expected an existing hex cover colour.");
    const alternate =
      doc.color === doc.color.toUpperCase()
        ? doc.color.toLowerCase()
        : doc.color.toUpperCase();
    if (alternate === doc.color)
      throw new Error(
        "Choose a colour containing a hex letter for this check.",
      );
    // Hex casing preserves the rendered colour while exercising real published events.
    const changed = await client
      .patch(doc._id)
      .ifRevisionId(doc._rev)
      .set({ color: alternate })
      .commit();
    await client
      .patch(doc._id)
      .ifRevisionId(changed._rev)
      .set({ color: doc.color })
      .commit();
    console.log(
      JSON.stringify({
        tested: true,
        document: doc._id,
        restored: true,
        at: new Date().toISOString(),
      }),
    );
  } else if (mode === "status") {
    if (!existing) console.log(JSON.stringify({ configured: false }));
    else {
      const result = await management.request({
        url: `${path}/${existing.id}/attempts`,
        query: { limit: 5 },
      });
      const attempts = Array.isArray(result) ? result : result.attempts || [];
      console.log(
        JSON.stringify({
          configured: true,
          id: existing.id,
          name: existing.name,
          enabled: !existing.isDisabledByUser,
          includeDrafts: existing.includeDrafts,
          attempts: attempts.map(
            ({ resultCode, isFailure, createdAt, failureReason }) => ({
              resultCode,
              isFailure,
              createdAt,
              failureReason,
            }),
          ),
        }),
      );
    }
  } else throw new Error("Use configure, test, or status.");
} catch (error) {
  const message = String(error.message || error);
  console.error(
    secretUrl ? message.split(secretUrl).join("[redacted hook URL]") : message,
  );
  process.exitCode = 1;
}
