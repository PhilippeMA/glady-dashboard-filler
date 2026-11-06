import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWidgetContent } from '@gladysassistant/integration-sdk';
import { createFakeGladys } from '@gladysassistant/integration-sdk/testing';
import {
  BLANK_LINE,
  DEFAULT_HEIGHT,
  MAX_HEIGHT,
  SPACER_WIDGET,
  WIDGETS,
  buildSpacerContent,
  normalizeSettings,
} from '../src/widgets.js';

const gladys = createFakeGladys();
const getContent = (settings = {}) =>
  WIDGETS[SPACER_WIDGET].get(gladys, { settings, language: 'en', units: 'metric' });
const bodyText = (content) => content.components[0].text;

test('the default content is rendered exactly as sent', async () => {
  // [] = nothing the core would drop, truncate or trim to the content budget.
  assert.deepEqual(validateWidgetContent(await getContent()), []);
});

test('the content is never empty, so the core does not show its empty state', async () => {
  const content = await getContent();
  assert.ok(content.components.length > 0);
});

test('a blank line survives the trimming of the core', () => {
  // The core trims texts with String.prototype.trim and drops empty ones: the
  // blank line must not be whitespace, or the component would be dropped.
  assert.notEqual(BLANK_LINE.trim(), '');
  assert.equal(bodyText(buildSpacerContent()), BLANK_LINE);
});

test('the height setting gives the number of lines', () => {
  for (const height of [1, 5, MAX_HEIGHT]) {
    const content = buildSpacerContent({ height });
    assert.deepEqual(validateWidgetContent(content), []);
    assert.equal(bodyText(content).split('\n').length, height);
  }
});

test('the text, when set, takes the first line', () => {
  const content = buildSpacerContent({ height: 3, text: '  Coming soon  ' });
  assert.deepEqual(validateWidgetContent(content), []);
  assert.deepEqual(bodyText(content).split('\n'), ['Coming soon', BLANK_LINE, BLANK_LINE]);
});

test('the longest text at the highest height still fits the body bound', () => {
  // A widget string setting holds at most 100 characters.
  const content = buildSpacerContent({ height: MAX_HEIGHT, text: 'x'.repeat(100) });
  assert.deepEqual(validateWidgetContent(content), []);
});

test('settings are normalized: strings, out-of-range and garbage values', () => {
  assert.deepEqual(normalizeSettings(), { height: DEFAULT_HEIGHT, text: '' });
  assert.deepEqual(normalizeSettings(null), { height: DEFAULT_HEIGHT, text: '' });
  assert.equal(normalizeSettings({ height: '4' }).height, 4);
  assert.equal(normalizeSettings({ height: 2.6 }).height, 3);
  assert.equal(normalizeSettings({ height: 0 }).height, 1);
  assert.equal(normalizeSettings({ height: 999 }).height, MAX_HEIGHT);
  assert.equal(normalizeSettings({ height: 'abc' }).height, DEFAULT_HEIGHT);
  assert.equal(normalizeSettings({ text: 42 }).text, '');
  assert.equal(normalizeSettings({ text: '   ' }).text, '');
});
