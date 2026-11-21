import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { openingBootstrap } from "../src/features/home/opening-bootstrap.ts";

class Target {
  listeners = new Map();

  addEventListener(type, callback, options = {}) {
    const callbacks = this.listeners.get(type) ?? new Set();
    callbacks.add(callback);
    this.listeners.set(type, callbacks);
    options.signal?.addEventListener("abort", () => callbacks.delete(callback), { once: true });
  }

  emit(type, properties = {}) {
    for (const callback of [...(this.listeners.get(type) ?? [])]) {
      callback({ target: this, ...properties });
    }
  }
}

function page({ pathname = "/", hash = "", navigationType = "navigate", reducedMotion = false } = {}) {
  const root = {
    dataset: {},
    style: new Map(),
    removeAttribute() { delete this.dataset.homeOpening; },
  };
  root.style.setProperty = root.style.set.bind(root.style);
  root.style.removeProperty = root.style.delete.bind(root.style);
  const opening = new Target();
  opening.firstElementChild = { getBoundingClientRect: () => ({ left: 450, top: 250, width: 100, height: 80 }) };
  const header = { getBoundingClientRect: () => ({ left: 24, top: 24, width: 34, height: 27.2 }) };
  const document = Object.assign(new Target(), {
    documentElement: root,
    readyState: "loading",
    hidden: false,
    getElementById: () => opening,
    querySelector: () => header,
  });
  const window = new Target();
  const motion = Object.assign(new Target(), { matches: reducedMotion });
  const timers = new Map();
  const frames = new Map();
  let id = 0;
  vm.runInNewContext(openingBootstrap, {
    document, window, AbortController, scrollY: 0,
    location: { pathname, hash },
    performance: { getEntriesByType: () => [{ type: navigationType }] },
    matchMedia: () => motion,
    CSS: { supports: () => true },
    setTimeout(callback, delay) { timers.set(++id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    requestAnimationFrame(callback) { frames.set(++id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
  });
  function parse() {
    document.readyState = "interactive";
    document.emit("DOMContentLoaded");
    for (const [id, callback] of frames) {
      frames.delete(id);
      callback();
    }
  }
  return { root, document, window, opening, timers, motion, parse };
}

test("covers the initial document and starts after parsing without React", () => {
  const state = page();
  assert.equal(state.root.dataset.homeOpening, "pending");
  assert.equal([...state.timers.values()][0].delay, 8000);
  state.parse();
  assert.equal(state.root.dataset.homeOpening, "playing");
  assert.equal(state.root.style.get("--handoff-scale"), "0.34");
  assert.equal(state.timers.size, 1);
  assert.equal([...state.timers.values()][0].delay, 3500);
});

test("layout, focus, and scroll events cannot dismiss the opening", () => {
  const state = page();
  for (const stage of ["pending", "playing"]) {
    if (stage === "playing") state.parse();
    for (const type of ["scroll", "resize", "focusin"]) state.window.emit(type, { isTrusted: true });
    assert.equal(state.root.dataset.homeOpening, stage);
  }
});

test("finishes only at the end of the opening's own timeline", () => {
  const state = page();
  state.parse();
  state.opening.emit("animationend", { animationName: "home-opening-assemble" });
  state.opening.emit("animationend", { target: {}, animationName: "home-opening-visibility" });
  assert.equal(state.root.dataset.homeOpening, "playing");
  state.opening.emit("animationend", { animationName: "home-opening-visibility" });
  assert.equal(state.root.dataset.homeOpening, undefined);
  assert.equal(state.timers.size, 0);
  assert.equal(state.root.style.size, 0);
});

test("intentional input skips during pending or playing and prevents a late restart", () => {
  for (const type of ["pointerdown", "wheel", "touchmove", "keydown"]) {
    for (const playing of [false, true]) {
      const state = page();
      if (playing) state.parse();
      state.window.emit(type, { isTrusted: false });
      assert.ok(state.root.dataset.homeOpening);
      state.window.emit(type, { isTrusted: true });
      state.parse();
      assert.equal(state.root.dataset.homeOpening, undefined);
      assert.equal(state.timers.size, 0);
    }
  }
});

test("skips deep links, history restoration, other routes, and reduced motion", () => {
  for (const options of [{ hash: "#selected-work" }, { navigationType: "back_forward" }, { pathname: "/about/" }, { reducedMotion: true }]) {
    const state = page(options);
    state.parse();
    assert.equal(state.root.dataset.homeOpening, undefined);
    assert.equal(state.timers.size, 0);
  }
});

test("failure watchdog releases the cover during startup or playback", () => {
  for (const playing of [false, true]) {
    const state = page();
    if (playing) state.parse();
    [...state.timers.values()][0].callback();
    state.parse();
    assert.equal(state.root.dataset.homeOpening, undefined);
    assert.equal(state.timers.size, 0);
  }
});
