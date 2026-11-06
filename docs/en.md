# Dashboard Filler

Gladys does not render the empty columns of a dashboard: configure three
columns, fill only one, and it takes the whole width. This integration adds
an **Empty space** widget: dropped in a column, it keeps that column, so the
dashboard shows the number of columns you chose.

## Installation

1. Install the **Dashboard Filler** integration from the Gladys integration
   catalog (Gladys 5.1 or later).
2. There is nothing to configure: the Configuration screen only shows that
   the integration is connected.

## Usage

1. Edit your dashboard.
2. In every column that should stay empty, add an **Integration widget** box
   and pick **Empty space**.
3. Save.

Widget settings (optional):

- **Height (in lines)** — height of the blank area of the card, 1 to 20
  lines of text (1 by default). Handy to line the card up with its
  neighbors.
- **Text (optional)** — a text shown at the top of the card ("Coming
  soon"…). Left empty, the card is blank.

## Limits

Gladys always draws the frame and the header of an integration widget card:
the integration can only make its content blank. For the most discreet
header, give the widget a short **name** in the dashboard editor (a single
space, or "·"): it replaces the "Empty space" name, the icon stays.

## Troubleshooting

- The card says the integration is stopped: start it from its Configuration
  screen.
- Read the integration logs from the Gladys interface (or `docker logs` on
  the host), with `LOG_LEVEL=debug` for the full detail.
