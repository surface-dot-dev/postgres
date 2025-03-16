// Integer Types
const INT = 'int';
const SMALLINT = 'smallint';
const INTEGER = 'integer';
const BIGINT = 'bigint';
const INT2 = 'int2';
const INT4 = 'int4';
const INT8 = 'int8';

// Arbitrary Precision Numbers
const DECIMAL = 'decimal';
const NUMERIC = 'numeric';

// Floating-Point Types
const REAL = 'real';
const DOUBLE_PRECISION = 'double precision';
const FLOAT4 = 'float4';
const FLOAT8 = 'float8';

// Serial Types
const SMALLSERIAL = 'smallserial';
const SERIAL = 'serial';
const BIGSERIAL = 'bigserial';
const SERIAL2 = 'serial2';
const SERIAL4 = 'serial4';
const SERIAL8 = 'serial8';

// Boolean Type
const BOOL = 'bool';
const BOOLEAN = 'boolean';

// Character Types
const CHAR = 'char';
const CHARACTER = 'character';
const VARCHAR = 'varchar';
const CHARACTER_VARYING = 'character varying';
const TEXT = 'text';

// JSON Types
const JSON_TYPE = 'json';
const JSONB = 'jsonb';

// Date/Time Types
const DATE = 'date';
const TIME = 'time';
const TIME_WITHOUT_TIME_ZONE = 'time without time zone';
const TIME_WITH_TIME_ZONE = 'time with time zone';
const TIMETZ = 'timetz';
const TIMESTAMP = 'timestamp';
const TIMESTAMP_WITHOUT_TIME_ZONE = 'timestamp without time zone';
const TIMESTAMP_WITH_TIME_ZONE = 'timestamp with time zone';
const TIMESTAMPTZ = 'timestamptz';

export const dataTypes = {
  // Integer Types
  INT,
  SMALLINT,
  INTEGER,
  BIGINT,
  INT2,
  INT4,
  INT8,

  // Arbitrary Precision Numbers
  DECIMAL,
  NUMERIC,

  // Floating-Point Types
  REAL,
  DOUBLE_PRECISION,
  FLOAT4,
  FLOAT8,

  // Serial Types
  SMALLSERIAL,
  SERIAL,
  BIGSERIAL,
  SERIAL2,
  SERIAL4,
  SERIAL8,

  // Boolean Type
  BOOL,
  BOOLEAN,

  // Character Types
  CHAR,
  CHARACTER,
  VARCHAR,
  CHARACTER_VARYING,
  TEXT,

  // JSON Types
  JSON_TYPE,
  JSONB,

  // Date/Time Types
  DATE,
  TIME,
  TIME_WITHOUT_TIME_ZONE,
  TIME_WITH_TIME_ZONE,
  TIMETZ,
  TIMESTAMP,
  TIMESTAMP_WITHOUT_TIME_ZONE,
  TIMESTAMP_WITH_TIME_ZONE,
  TIMESTAMPTZ,
};

export const getResolvedDataType = (t: string): string | null => {
  t = t || '';

  // int2
  if ([SMALLINT, INT2].includes(t)) {
    return INT2;
  }
  // int4
  if ([INTEGER, INT, INT4].includes(t)) {
    return INT4;
  }
  // int8
  if ([BIGINT, INT8].includes(t)) {
    return INT8;
  }
  // numeric
  if (!!t.match(new RegExp(`(${NUMERIC}|${DECIMAL})`, 'gi'))) {
    return NUMERIC;
  }
  // float4
  if (!!t.match(new RegExp(`(${REAL}|${FLOAT4})`, 'gi'))) {
    return FLOAT4;
  }
  // float8
  if (!!t.match(new RegExp(`(${DOUBLE_PRECISION}|${FLOAT8})`, 'gi'))) {
    return FLOAT8;
  }
  // boolean
  if ([BOOL, BOOLEAN].includes(t)) {
    return BOOLEAN;
  }
  // varchar
  if (!!t.match(new RegExp(`(${CHARACTER_VARYING}|${VARCHAR})`, 'gi'))) {
    return VARCHAR;
  }
  // char
  if (!!t.match(new RegExp(`(${CHARACTER}|${CHAR})`, 'gi'))) {
    return CHAR;
  }
  // text
  if (t === TEXT) {
    return TEXT;
  }
  // json
  if (t === JSON_TYPE) {
    return JSON_TYPE;
  }
  // jsonb
  if (t === JSONB) {
    return JSONB;
  }
  // date
  if (t === DATE) {
    return DATE;
  }
  // timestamptz
  if (!!t.match(new RegExp(`(${TIMESTAMP_WITH_TIME_ZONE}|${TIMESTAMPTZ})`, 'gi'))) {
    return TIMESTAMPTZ;
  }
  // timestamp
  if (!!t.match(new RegExp(`(${TIMESTAMP_WITHOUT_TIME_ZONE}|${TIMESTAMP})`, 'gi'))) {
    return TIMESTAMP;
  }
  // timetz
  if (!!t.match(new RegExp(`(${TIME_WITH_TIME_ZONE}|${TIMETZ})`, 'gi'))) {
    return TIMETZ;
  }
  // time
  if (!!t.match(new RegExp(`(${TIME_WITHOUT_TIME_ZONE}|${TIME})`, 'gi'))) {
    return TIME;
  }
  // Unknown/other
  return null;
};
