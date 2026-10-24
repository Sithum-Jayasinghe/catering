import sql from 'mssql';

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
  database: process.env.DB_NAME || 'SriLankanCateringInventoryDB',
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
    },
  },
};

// Use Windows auth (Integrated Security) when no DB_USER is set
const integratedConfig: sql.config = {
  server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
  database: process.env.DB_NAME || 'SriLankanCateringInventoryDB',
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    trustedConnection: true,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) return pool;
  const useIntegrated = !process.env.DB_USER;
  pool = await sql.connect(useIntegrated ? integratedConfig : config);
  return pool;
}

export async function query<T = Record<string, unknown>>(
  queryStr: string,
  params?: Record<string, sql.ISqlTypeFactory | string | number | boolean | Date | null>
): Promise<T[]> {
  try {
    const p = await getPool();
    const request = p.request();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }
    }
    const result = await request.query(queryStr);
    return result.recordset as T[];
  } catch (err) {
    console.error('[SqlDb] Query error:', err);
    return [];
  }
}
