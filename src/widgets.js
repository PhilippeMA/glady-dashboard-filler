// -----------------------------------------------------------------------------
// Dashboard widget "spacer" (SDK v0.14+, Gladys 5.1+).
//
// Why this widget exists: on a Gladys dashboard, a column without any widget
// is treated as editor scaffolding and is NOT rendered — the remaining columns
// share the whole width. Dropping a "spacer" widget in such a column keeps it,
// so the dashboard shows exactly the number of columns chosen in the editor.
//
// The card itself cannot be made invisible (the core always draws the card
// and its header), but its body can be blank:
//   - an empty `components` array is NOT blank: the core renders it as the
//     "Nothing to display yet" empty state;
//   - a `text` made only of zero-width spaces is: the core strips control
//     characters and trims whitespace, but U+200B is neither, so the text is
//     kept and renders as an invisible line. One such line per unit of the
//     `height` setting gives the card the height the user wants.
// -----------------------------------------------------------------------------

import { createLogger, WIDGET_TEXT_VARIANTS } from '@gladysassistant/integration-sdk';

const logger = createLogger({ name: 'widgets' });

// Widget key, as declared in the manifest `widgets` field.
export const SPACER_WIDGET = 'spacer';

// Bounds of the `height` setting, as declared in the manifest.
export const DEFAULT_HEIGHT = 1;
export const MIN_HEIGHT = 1;
export const MAX_HEIGHT = 20;

// Invisible, but neither whitespace nor a control character: survives the
// normalization of the core (see the header of this file).
export const BLANK_LINE = '​';

// The content never changes for given settings (the core caches it per
// settings): the longest TTL the core accepts.
const TTL_SECONDS = 3600;

/**
 * Normalize the per-instance settings of a spacer box. They come from the
 * dashboard JSON: never trust their type or range.
 * @param {Record<string, unknown>} [settings]
 * @returns {{ height: number, text: string }}
 */
export function normalizeSettings(settings = {}) {
  const raw = Number(settings?.height);
  const height = Number.isFinite(raw)
    ? Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(raw)))
    : DEFAULT_HEIGHT;
  const text = typeof settings?.text === 'string' ? settings.text.trim() : '';
  return { height, text };
}

/**
 * Build the content of a spacer box: `height` lines, the first one holding
 * the optional text, the others blank.
 * @param {Record<string, unknown>} [settings]
 */
export function buildSpacerContent(settings) {
  const { height, text } = normalizeSettings(settings);
  const lines = Array.from({ length: height }, () => BLANK_LINE);
  if (text) {
    lines[0] = text;
  }
  return {
    ttl_seconds: TTL_SECONDS,
    components: [
      {
        type: 'text',
        // `body` is the only variant that honors line breaks.
        variant: WIDGET_TEXT_VARIANTS.BODY,
        text: lines.join('\n'),
      },
    ],
  };
}

export const WIDGETS = {
  [SPACER_WIDGET]: {
    async get(_gladys, { settings }) {
      logger.debug(`onWidgetGet <- ${SPACER_WIDGET}`);
      return buildSpacerContent(settings);
    },
  },
};
