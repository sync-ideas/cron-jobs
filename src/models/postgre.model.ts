import dotenv from 'dotenv'
dotenv.config()

import { Client, QueryResult } from 'pg';
const postgres_uri = process.env.POSTGRES_URI

class PostgreSQL {
  private static instance: PostgreSQL
  private client: Client

  private constructor() {
    this.client = new Client({
      connectionString: postgres_uri
    })
    this.client.connect()
  }

  public static getInstance(): PostgreSQL {
    if (!PostgreSQL.instance) {
      PostgreSQL.instance = new PostgreSQL()
    }
    return PostgreSQL.instance
  }

  public async query(query: string, values?: any[]): Promise<QueryResult<any>> {
    try {
      const result = await this.client.query(query, values)
      return result
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public async close(): Promise<void> {
    try {
      await this.client.end()
      console.log('Disconnected from PostgreSQL')
    } catch (error) {
      console.log(error)
    }
  }

}

export default PostgreSQL