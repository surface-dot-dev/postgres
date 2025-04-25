/** @fileoverview
 * Modernized ES6 version of pg-format that also works client-side.
 */
const reservedMap = {
  AES128: true,
  AES256: true,
  ALL: true,
  ALLOWOVERWRITE: true,
  ANALYSE: true,
  ANALYZE: true,
  AND: true,
  ANY: true,
  ARRAY: true,
  AS: true,
  ASC: true,
  AUTHORIZATION: true,
  BACKUP: true,
  BETWEEN: true,
  BINARY: true,
  BLANKSASNULL: true,
  BOTH: true,
  BYTEDICT: true,
  CASE: true,
  CAST: true,
  CHECK: true,
  COLLATE: true,
  COLUMN: true,
  CONSTRAINT: true,
  CREATE: true,
  CREDENTIALS: true,
  CROSS: true,
  CURRENT_DATE: true,
  CURRENT_TIME: true,
  CURRENT_TIMESTAMP: true,
  CURRENT_USER: true,
  CURRENT_USER_ID: true,
  DEFAULT: true,
  DEFERRABLE: true,
  DEFLATE: true,
  DEFRAG: true,
  DELTA: true,
  DELTA32K: true,
  DESC: true,
  DISABLE: true,
  DISTINCT: true,
  DO: true,
  ELSE: true,
  EMPTYASNULL: true,
  ENABLE: true,
  ENCODE: true,
  ENCRYPT: true,
  ENCRYPTION: true,
  END: true,
  EXCEPT: true,
  EXPLICIT: true,
  FALSE: true,
  FOR: true,
  FOREIGN: true,
  FREEZE: true,
  FROM: true,
  FULL: true,
  GLOBALDICT256: true,
  GLOBALDICT64K: true,
  GRANT: true,
  GROUP: true,
  GZIP: true,
  HAVING: true,
  IDENTITY: true,
  IGNORE: true,
  ILIKE: true,
  IN: true,
  INITIALLY: true,
  INNER: true,
  INTERSECT: true,
  INTO: true,
  IS: true,
  ISNULL: true,
  JOIN: true,
  LEADING: true,
  LEFT: true,
  LIKE: true,
  LIMIT: true,
  LOCALTIME: true,
  LOCALTIMESTAMP: true,
  LUN: true,
  LUNS: true,
  LZO: true,
  LZOP: true,
  MINUS: true,
  MOSTLY13: true,
  MOSTLY32: true,
  MOSTLY8: true,
  NATURAL: true,
  NEW: true,
  NOT: true,
  NOTNULL: true,
  NULL: true,
  NULLS: true,
  OFF: true,
  OFFLINE: true,
  OFFSET: true,
  OLD: true,
  ON: true,
  ONLY: true,
  OPEN: true,
  OR: true,
  ORDER: true,
  OUTER: true,
  OVERLAPS: true,
  PARALLEL: true,
  PARTITION: true,
  PERCENT: true,
  PLACING: true,
  PRIMARY: true,
  RAW: true,
  READRATIO: true,
  RECOVER: true,
  REFERENCES: true,
  REJECTLOG: true,
  RESORT: true,
  RESTORE: true,
  RIGHT: true,
  SELECT: true,
  SESSION_USER: true,
  SIMILAR: true,
  SOME: true,
  SYSDATE: true,
  SYSTEM: true,
  TABLE: true,
  TAG: true,
  TDES: true,
  TEXT255: true,
  TEXT32K: true,
  THEN: true,
  TO: true,
  TOP: true,
  TRAILING: true,
  TRUE: true,
  TRUNCATECOLUMNS: true,
  UNION: true,
  UNIQUE: true,
  USER: true,
  USING: true,
  VERBOSE: true,
  WALLET: true,
  WHEN: true,
  WHERE: true,
  WITH: true,
  WITHOUT: true,
};

const fmtPattern = {
  ident: 'I',
  literal: 'L',
  string: 's',
};

// convert to Postgres default ISO 8601 format
const formatDate = (date) => {
  date = date.replace('T', ' ');
  date = date.replace('Z', '+00');
  return date;
};

const isReserved = (value) => {
  return !!reservedMap[value.toUpperCase()];
};

const arrayToList = (useSpace, array, formatter) => {
  let sql = '';
  sql += useSpace ? ' (' : '(';
  sql += array.map((item) => formatter(item)).join(', ');
  sql += ')';
  return sql;
};

// Ported from PostgreSQL 9.2.4 source code in src/interfaces/libpq/fe-exec.c
const quoteIdent = (value) => {
  if (value === undefined || value === null) {
    throw new Error('SQL identifier cannot be null or undefined');
  }
  if (value === false) return '"f"';
  if (value === true) return '"t"';
  if (value instanceof Date) return `"${formatDate(value.toISOString())}"`;
  if (value instanceof ArrayBuffer || value instanceof Uint8Array) {
    throw new Error('SQL identifier cannot be a binary buffer');
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (Array.isArray(item)) {
          throw new Error(
            'Nested array to grouped list conversion is not supported for SQL identifier'
          );
        }
        return quoteIdent(item);
      })
      .toString();
  }
  if (value === Object(value)) {
    throw new Error('SQL identifier cannot be an object');
  }

  const ident = value.toString().slice(0);

  // do not quote a valid, unquoted identifier
  if (/^[a-z_][a-z0-9_$]*$/.test(ident) && !isReserved(ident)) {
    return ident;
  }

  let quoted = '"';
  for (const c of ident) {
    quoted += c === '"' ? c + c : c;
  }
  quoted += '"';

  return quoted;
};

// Ported from PostgreSQL 9.2.4 source code in src/interfaces/libpq/fe-exec.c
const quoteLiteral = (value) => {
  if (value === undefined || value === null) return 'NULL';
  if (value === false) return "'f'";
  if (value === true) return "'t'";
  if (value instanceof Date) return `'${formatDate(value.toISOString())}'`;
  if (value instanceof ArrayBuffer || value instanceof Uint8Array) {
    const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : value;
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return `E'\\\\x${hex}'`;
  }
  if (Array.isArray(value)) {
    return value
      .map((item, i) => {
        if (Array.isArray(item)) {
          return arrayToList(i !== 0, item, quoteLiteral);
        }
        return quoteLiteral(item);
      })
      .toString();
  }
  if (value === Object(value)) {
    return `'${JSON.stringify(value)}'::jsonb`;
  }

  return `'${value.toString()}'`;
};

const quoteString = (value) => {
  return value.toString().slice(0); // return copy
};

const config = (cfg) => {
  // default
  fmtPattern.ident = 'I';
  fmtPattern.literal = 'L';
  fmtPattern.string = 's';

  if (cfg?.pattern) {
    const { pattern } = cfg;
    if (pattern.ident) fmtPattern.ident = pattern.ident;
    if (pattern.literal) fmtPattern.literal = pattern.literal;
    if (pattern.string) fmtPattern.string = pattern.string;
  }
};

const formatWithArray = (fmt, parameters) => {
  let index = 0;
  const params = parameters;

  const re = new RegExp(
    `%(%|(\\d+\\$)?[${fmtPattern.ident}${fmtPattern.literal}${fmtPattern.string}])`,
    'g'
  );

  return fmt.replace(re, (_, type) => {
    if (type === '%') return '%';

    let position = index;
    const tokens = type.split('$');

    if (tokens.length > 1) {
      position = parseInt(tokens[0]) - 1;
      type = tokens[1];
    }

    if (position < 0) {
      throw new Error('specified argument 0 but arguments start at 1');
    }
    if (position > params.length - 1) {
      throw new Error('too few arguments');
    }

    index = position + 1;

    if (type === fmtPattern.ident) return quoteIdent(params[position]);
    if (type === fmtPattern.literal) return quoteLiteral(params[position]);
    if (type === fmtPattern.string) return quoteString(params[position]);
  });
};

const format = (fmt, ...args) => {
  return formatWithArray(fmt, args);
};

export {
  format as default,
  config,
  quoteIdent as ident,
  quoteLiteral as literal,
  quoteString as string,
  formatWithArray as withArray,
};
