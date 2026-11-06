// -----------------------------------------------------------------------------
// Consistency checks between `gladys-assistant-integration.json` and the code.
// The manifest is validated by the store indexer, but nothing there can know
// which handlers the code actually registers — these tests keep both in sync.
// -----------------------------------------------------------------------------

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { WIDGETS, SPACER_WIDGET, DEFAULT_HEIGHT, MIN_HEIGHT, MAX_HEIGHT } from '../src/widgets.js';

const manifest = JSON.parse(
  await readFile(new URL('../gladys-assistant-integration.json', import.meta.url), 'utf8'),
);
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

const keysOf = (list) => (list ?? []).map((entry) => entry.key);
const settingsFields = (manifest.widgets ?? []).flatMap((widget) => widget.settings ?? []);

// Minimum version of the manifest `gladys_version` range, e.g. [5, 1, 0].
function minGladysVersion() {
  const match = manifest.gladys_version.match(/>=\s*(\d+)\.(\d+)\.(\d+)/);
  assert.ok(match, 'gladys_version must declare a minimum version');
  return match.slice(1).map(Number);
}

function isAtLeast(version, required) {
  for (let i = 0; i < required.length; i += 1) {
    if (version[i] !== required[i]) {
      return version[i] > required[i];
    }
  }
  return true;
}

test('a provider integration declares widgets and requires Gladys >= 5.1.0', () => {
  // Older cores reject the `provider` type and the `widgets` field.
  assert.equal(manifest.type, 'provider');
  assert.ok(manifest.widgets.length >= 1 && manifest.widgets.length <= 5);
  assert.ok(
    isAtLeast(minGladysVersion(), [5, 1, 0]),
    `widgets require gladys_version >= 5.1.0, got "${manifest.gladys_version}"`,
  );
});

test('catalog categories: 1 to 3 entries', () => {
  assert.ok(manifest.categories.length >= 1 && manifest.categories.length <= 3);
});

test('every widgets key has an onWidgetGet handler, and vice versa', () => {
  const declared = keysOf(manifest.widgets);
  for (const key of declared) {
    assert.equal(typeof WIDGETS[key]?.get, 'function', `widget "${key}" has no content handler`);
  }
  for (const key of Object.keys(WIDGETS)) {
    assert.ok(declared.includes(key), `widget "${key}" is not declared in widgets`);
  }
});

test('widget keys, labels and descriptions follow the store rules', () => {
  for (const widget of manifest.widgets) {
    assert.match(widget.key, /^[a-z0-9_]{2,32}$/);
    for (const [lang, text] of Object.entries(widget.label)) {
      assert.ok(text.length >= 3 && text.length <= 30, `widget label.${lang}: 3 to 30 characters`);
    }
    for (const [lang, text] of Object.entries(widget.description ?? {})) {
      assert.ok(text.length <= 100, `widget description.${lang}: at most 100 characters`);
    }
  }
});

test('the height setting of the spacer mirrors the bounds of the code', () => {
  const spacer = manifest.widgets.find((widget) => widget.key === SPACER_WIDGET);
  const height = spacer.settings.find((field) => field.key === 'height');
  assert.equal(height.default, DEFAULT_HEIGHT);
  assert.equal(height.min, MIN_HEIGHT);
  assert.equal(height.max, MAX_HEIGHT);
});

test('the manifest version is the package version, and the image is tagged with it', () => {
  // The Release workflow writes all three: a mismatch means one was edited by
  // hand, and Gladys would offer a version whose image is another one.
  assert.equal(manifest.version, pkg.version, 'manifest version must match package.json');
  assert.ok(
    manifest.docker_image.endsWith(`:${manifest.version}`),
    `docker_image must be tagged :${manifest.version}, got "${manifest.docker_image}"`,
  );
});

test('the catalog description holds 10 to 100 characters per language', () => {
  assert.ok(manifest.description.en, 'the description needs an English text');
  for (const [lang, text] of Object.entries(manifest.description)) {
    assert.ok(
      text.length >= 10 && text.length <= 100,
      `description.${lang} has ${text.length} characters (10 to 100 allowed)`,
    );
  }
});

test('every text is a multi-language object with an English value', () => {
  // A plain string rejects the manifest, for placeholders too.
  for (const field of settingsFields) {
    for (const prop of ['label', 'description', 'placeholder']) {
      if (field[prop] !== undefined) {
        assert.equal(typeof field[prop], 'object', `setting "${field.key}": ${prop}`);
        assert.ok(field[prop].en, `setting "${field.key}": ${prop} needs an English text`);
        assert.ok(field[prop].fr, `setting "${field.key}": ${prop} needs a French text`);
      }
    }
  }
});
