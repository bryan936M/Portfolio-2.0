import test from "node:test";
import assert from "node:assert/strict";
import { africanCountries, countryLabels, globePoint, resolveWorkCountries } from "../src/content/work-countries.ts";

test("missing work countries initialize while deliberate removals and ordering survive", () => {
  assert.deepEqual(resolveWorkCountries(undefined).map(country => country.code), ["RW", "BJ", "ZM"]);
  assert.deepEqual(resolveWorkCountries([]), []);
  assert.deepEqual(resolveWorkCountries(["ZM", "BJ"]).map(country => country.code), ["ZM", "BJ"]);
});

test("unsupported or duplicate entries cannot create broken globe markers", () => {
  assert.deepEqual(resolveWorkCountries(["RW", "US", "RW", 123, null, "BJ"]).map(country => country.code), ["RW", "BJ"]);
  assert.deepEqual(resolveWorkCountries("RW"), []);
  assert.equal(africanCountries.length, 54);
  assert.equal(new Set(africanCountries.map(country => country.code)).size, africanCountries.length);
  for (const country of africanCountries) {
    assert.ok(Number.isFinite(country.longitude) && Number.isFinite(country.latitude));
  }
});

test("the initial work countries face the camera throughout the five-degree rocking range", () => {
  const countries = resolveWorkCountries(undefined);
  for (const country of countries) {
    const [x, , z] = globePoint(country.longitude, country.latitude);
    for (const angle of [-5, 0, 5]) assert.ok(z * Math.cos(angle * Math.PI / 180) - x * Math.sin(angle * Math.PI / 180) > .7);
  }
  const labels = countryLabels(countries);
  assert.equal(labels.find(country => country.code === "BJ").side, "left");
  assert.ok(Math.abs(labels.find(country => country.code === "RW").y - labels.find(country => country.code === "ZM").y) > 100);
});
