import { neon } from '@neondatabase/serverless';
import { logError, logInfo } from "./logger.mjs";

/**
 * NeonManager class for handling PostgreSQL operations using Neon serverless
 */
class NeonManager {
    constructor() {
        this.sql = neon(process.env.DATABASE_URL);
    }

    /**
     * Insert data into a table.
     * @param {string} tableName - Name of the table to insert into.
     * @param {Object} data - Data object with column names as keys and values as values.
     * @returns {Promise<number|null>} - The ID of the inserted row.
     */
    async insertData(tableName, data) {
        try {
            const columns = Object.keys(data).join(", ");
            const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(", ");
            const values = Object.values(data);
            
            const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING id`;
            const result = await this.sql(query, values);
            return result[0]?.id || null;
        } catch (error) {
            logError(`Failed to insert data into '${tableName}': ${error.message}`);
            return null;
        }
    }

    /**
     * Update data in a table.
     * @param {string} tableName - Name of the table to update.
     * @param {Object} data - Data object with column names and values to update.
     * @param {Object} whereClause - Object with conditions for the WHERE clause.
     */
    async updateData(tableName, data, whereClause) {
        try {
            const dataKeys = Object.keys(data);
            const whereKeys = Object.keys(whereClause);
            
            const updates = dataKeys.map((col, i) => `${col} = $${i + 1}`).join(", ");
            const conditions = whereKeys.map((col, i) => `${col} = $${dataKeys.length + i + 1}`).join(" AND ");
            
            const values = [...Object.values(data), ...Object.values(whereClause)];
            const query = `UPDATE ${tableName} SET ${updates} WHERE ${conditions}`;
            
            await this.sql(query, values);
        } catch (error) {
            logError(`Failed to update data in '${tableName}': ${error.message}`);
        }
    }

    /**
     * Delete data from a table.
     * @param {string} tableName - Name of the table to delete from.
     * @param {Object} whereClause - Object with conditions for the WHERE clause.
     */
    async deleteData(tableName, whereClause) {
        try {
            const whereKeys = Object.keys(whereClause);
            const conditions = whereKeys.map((col, i) => `${col} = $${i + 1}`).join(" AND ");
            const values = Object.values(whereClause);
            
            const query = `DELETE FROM ${tableName} WHERE ${conditions}`;
            await this.sql(query, values);
        } catch (error) {
            logError(`Failed to delete data from '${tableName}': ${error.message}`);
        }
    }

    /**
     * Fetch data from a table.
     * @param {string} tableName - Name of the table to fetch data from.
     * @param {string[]} columns - Array of column names to fetch (e.g., ['id', 'name']).
     * @param {Object} [whereClause] - Optional conditions for the WHERE clause.
     * @returns {Promise<Object[]>} - Array of fetched rows.
     */
    async fetchData(tableName, columns, whereClause = {}) {
        try {
            const cols = columns.join(", ");
            const whereKeys = Object.keys(whereClause);
            
            let query;
            let values = [];
            
            if (whereKeys.length > 0) {
                const conditions = whereKeys.map((col, i) => `${col} = $${i + 1}`).join(" AND ");
                values = Object.values(whereClause);
                query = `SELECT ${cols} FROM ${tableName} WHERE ${conditions}`;
            } else {
                query = `SELECT ${cols} FROM ${tableName}`;
            }
            
            const rows = await this.sql(query, values);
            return rows;
        } catch (error) {
            logError(`Failed to fetch data from '${tableName}': ${error.message}`);
            return [];
        }
    }

    /**
     * Get the count of records in a given table with an optional condition.
     * @param {string} tableName - The name of the table to count records from.
     * @param {string} [condition] - Optional condition for the count query.
     * @returns {Promise<number>} - The count of records.
     */
    async getCount(tableName, condition) {
        try {
            const query = condition
                ? `SELECT COUNT(*) AS count FROM ${tableName} WHERE ${condition}`
                : `SELECT COUNT(*) AS count FROM ${tableName}`;
            const result = await this.sql(query);
            return parseInt(result[0]?.count) || 0;
        } catch (error) {
            logError(`Failed to get count from '${tableName}': ${error.message}`);
            return 0;
        }
    }

    /**
     * Close method (no-op for serverless, kept for compatibility)
     */
    close() {
        // Neon serverless doesn't need explicit connection closing
        logInfo("Neon connection cleanup (no-op for serverless)");
    }
}

export default NeonManager;
