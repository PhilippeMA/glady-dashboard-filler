import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWidgetContent } from '@gladysassistant/integration-sdk';
import { createFakeGladys } from '@gladysassistant/integration-sdk/testing';
import { registerHandlers } from '../src/app.js';
import { SPACER_WIDGET, WIDGETS } from '../src/widgets.js';

async function connectedGladys() {
  const gladys = createFakeGladys();
  registerHandlers(gladys);
  await gladys.connect();
  return gladys;
}

test('Gladys gets the spacer content through onWidgetGet', async () => {
  const gladys = await connectedGladys();
  const ack = await gladys.fake.widgetGet(SPACER_WIDGET, { settings: { height: 3 } });
  assert.equal(ack.success, true);
  assert.deepEqual(validateWidgetContent(ack.data.content), []);
  assert.equal(ack.data.content.components[0].text.split('\n').length, 3);
  await gladys.disconnect();
});

test('the integration reports itself connected and nudges its widgets', async () => {
  const gladys = await connectedGladys();
  assert.equal(gladys.fake.connectionStatus.connected, true);
  assert.deepEqual(gladys.fake.widgetRefreshes, Object.keys(WIDGETS));
  await gladys.disconnect();
});
