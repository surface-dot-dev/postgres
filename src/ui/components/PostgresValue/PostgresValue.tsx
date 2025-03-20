import styled from 'styled-components';
import * as dt from '@/utils/dataTypes';

export type PostgresValueProps = {
  type: string;
  children: React.ReactNode;
  context?: string;
};

const ctx = (type: string) => `"${type}" value`;

export const PostgresValue = ({ type, children, ...props }: PostgresValueProps) => {
  const resolvedType = dt.getResolvedDataType(type);
  const context = props.context || ctx(type);

  switch (resolvedType) {
    // Integers
    case dt.INT2:
    case dt.INT4:
    case dt.INT8:
      return <StyledNumber data-context={context}>{children}</StyledNumber>;

    // Floats
    case dt.NUMERIC:
    case dt.FLOAT4:
    case dt.FLOAT8:
      return <StyledNumber data-context={context}>{children}</StyledNumber>;

    // Booleans
    case dt.BOOLEAN:
      return <StyledBoolean data-context={context}>{children}</StyledBoolean>;

    // Date/Time
    case dt.DATE:
    case dt.TIMESTAMPTZ:
    case dt.TIMESTAMP:
    case dt.TIMETZ:
    case dt.TIME:
      return <StyledDateTime data-context={context}>{children}</StyledDateTime>;

    // JSON
    case dt.JSON_TYPE:
    case dt.JSONB:
      return <StyledJson data-context={context}>{children}</StyledJson>;

    // Text / Fallback
    default:
      return <StyledText data-context={context}>{children}</StyledText>;
  }
};

// ============================
//  Styled Components
// ============================

const StyledNumber = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-family: monospace;
`;

const StyledBoolean = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledDateTime = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledJson = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-family: Regular;
`;
