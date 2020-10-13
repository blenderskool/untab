import FSM from './utils/fsm';
import resetWritable from './utils/resetWritable';

export const results = resetWritable({ length: 0, items: {} });
export const searchVal = resetWritable({ query: '', plugin: {} });

export const inputState = FSM({
  initial: 'text',
  states: {
    plugin: {
      on: {
        TEXT: 'pluginText',
        BACK: 'text',
      },
    },
    pluginText: {
      on: {
        CLEAR: 'text'
      }
    },
    text: {
      on: {
        PLUGIN: 'plugin',
      },
    },
  }
});