import { MessageTimestamp, MessageTimestampFormat } from './time.js';

describe('time utils', () => {
  describe('MessageTimestamp', () => {
    const nowInSeconds = 1629274020;
    const now = new Date(nowInSeconds * 1e3);
    const ts = new MessageTimestamp(now);

    it('should stringify to the long full format by default', () => {
      expect(String(ts)).toEqual(`<t:${nowInSeconds}:F>`);
      expect(ts.toString()).toEqual(`<t:${nowInSeconds}:F>`);
      expect(`Event date: ${ts} (don't be late!)`)
        .toEqual(`Event date: <t:${nowInSeconds}:F> (don't be late!)`);
    });

    it('should stringify to the provided string representation', () => {
      expect(ts.toString(MessageTimestampFormat.SHORT_DATE)).toEqual(`<t:${nowInSeconds}:d>`);
      expect(ts.toString(MessageTimestampFormat.SHORT_FULL)).toEqual(`<t:${nowInSeconds}:f>`);
      expect(ts.toString(MessageTimestampFormat.SHORT_TIME)).toEqual(`<t:${nowInSeconds}:t>`);
      expect(ts.toString(MessageTimestampFormat.LONG_DATE)).toEqual(`<t:${nowInSeconds}:D>`);
      expect(ts.toString(MessageTimestampFormat.LONG_FULL)).toEqual(`<t:${nowInSeconds}:F>`);
      expect(ts.toString(MessageTimestampFormat.RELATIVE)).toEqual(`<t:${nowInSeconds}:R>`);
      expect(ts.toString(MessageTimestampFormat.LONG_TIME)).toEqual(`<t:${nowInSeconds}:T>`);
    });
  });
});
