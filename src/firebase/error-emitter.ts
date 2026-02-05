import { EventEmitter } from 'events';

// It is important to use a single instance of the EventEmitter
// to ensure that all events are emitted and received by the same instance.
export const errorEmitter = new EventEmitter();
