# Chess Clock

author: Khanh Nguyen

See working version here: https://chessclock.us

A simple chess clock built on Angular 12.

The clock can also be controlled by keyboard input:
  - `1` - Clock 1 control
  - `2` - Clock 2 control
  - `P` - Pause both clocks
  - `R` - Reset
  - `M` - Cycle through time presets

## Custom Time Mode
Click 'custom' button to set custom time mode.


Use this format: `{clock1 time}+{clock1 increment},{clock2 time}+{clock2 increment}`

Example: `7+5,10+3`

In the above example, Clock 1 will start with 7 minutes have and regain 5 seconds every move; Clock 2 will start with 10 minutes and regain 3 seconds every move.

## Building/Running Angular app

Requirements:
  - Node & npm: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
  - Angular CLI: https://angular.io/cli


To run locally:

    npm run start

To build/compile:

    npm run build

see Angular docs here: https://angular.io


sound effects sourced from: https://freesound.org
