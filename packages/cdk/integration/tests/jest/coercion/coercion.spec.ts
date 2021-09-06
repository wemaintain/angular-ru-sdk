import { coerceBoolean } from '@angular-ru/cdk/coercion';
import { Any } from '@angular-ru/cdk/typings';

describe('[TEST] Coercion', () => {
    it('coerceBoolean returned true', () => {
        expect(coerceBoolean('')).toEqual(true);
        expect(coerceBoolean('   ')).toEqual(true);
        expect(coerceBoolean(true)).toEqual(true);
        expect(coerceBoolean('true')).toEqual(true);
        expect(coerceBoolean('12312s')).toEqual(true);
        expect(coerceBoolean('0')).toEqual(true);
        expect(coerceBoolean(1)).toEqual(true);
        expect(coerceBoolean({} as Any)).toEqual(true);
        expect(coerceBoolean([] as Any)).toEqual(true);
    });

    it('coerceBoolean returned false', () => {
        expect(coerceBoolean(null)).toEqual(false);
        expect(coerceBoolean(undefined)).toEqual(false);
        expect(coerceBoolean(' false  ')).toEqual(false);
        expect(coerceBoolean('false')).toEqual(false);
        expect(coerceBoolean(false)).toEqual(false);
        expect(coerceBoolean(0)).toEqual(false);
    });
});
