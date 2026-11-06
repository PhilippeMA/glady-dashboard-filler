// -----------------------------------------------------------------------------
// SDK wiring of the integration, kept apart from index.js so the tests can run
// it against the fake Gladys of the SDK (integration-sdk/testing).
//
// A `provider` integration has no device surface: it only serves its
// dashboard widget, and reports itself connected so the Configuration screen
// shows it healthy.
// -----------------------------------------------------------------------------

import { logger } from '@gladysassistant/integration-sdk';
import { WIDGETS } from './widgets.js';

/**
 * Register every handler on the Gladys client. Must run BEFORE connect().
 * @param {import('@gladysassistant/integration-sdk').GladysIntegration} gladys
 */
export function registerHandlers(gladys) {
  // Each widget declared in the manifest `widgets` field is registered per key:
  // Gladys pulls its content (ack awaited under 15 s) with the per-box settings.
  for (const [widgetKey, widget] of Object.entries(WIDGETS)) {
    gladys.onWidgetGet(widgetKey, (request) => widget.get(gladys, request));
  }

  gladys.on('connected', async () => {
    try {
      // The content only depends on the per-box settings: nothing to
      // re-synchronize, but the nudges are cheap and the content may have
      // changed with a new version of the integration.
      for (const widgetKey of Object.keys(WIDGETS)) {
        gladys.requestWidgetRefresh(widgetKey);
      }
      await gladys.setConnectionStatus(true);
    } catch (err) {
      logger.error('Post-connection initialization failed', err);
    }
  });
}
