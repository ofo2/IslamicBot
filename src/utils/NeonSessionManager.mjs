import { neon } from '@neondatabase/serverless';
import { logError } from "./logger.mjs";

/**
 * NeonSessionManager for handling session storage with PostgreSQL.
 */
class NeonSessionManager {
    constructor() {
        this.sql = neon(process.env.DATABASE_URL);
    }

    /**
     * Get session data by key.
     * @param {string} key - Session key (usually chat_id:user_id).
     * @returns {Promise<Object|null>} - Session data or null if not found.
     */
    async get(key) {
        try {
            const result = await this.sql`SELECT data FROM sessions WHERE key = ${key}`;
            return result.length > 0 ? JSON.parse(result[0].data) : null;
        } catch (error) {
            logError(`Failed to get session for key '${key}': ${error.message}`);
            return null;
        }
    }

    /**
     * Save or update session data.
     * @param {string} key - Session key (usually chat_id:user_id).
     * @param {Object} value - Session data to store.
     */
    async set(key, value) {
        try {
            const data = JSON.stringify(value);
            await this.sql`
                INSERT INTO sessions (key, data) 
                VALUES (${key}, ${data})
                ON CONFLICT (key) 
                DO UPDATE SET data = ${data}
            `;
        } catch (error) {
            logError(`Failed to set session for key '${key}': ${error.message}`);
        }
    }

    /**
     * Delete session by key.
     * @param {string} key - Session key to delete.
     */
    async delete(key) {
        try {
            await this.sql`DELETE FROM sessions WHERE key = ${key}`;
        } catch (error) {
            logError(`Failed to delete session for key '${key}': ${error.message}`);
        }
    }
}

export default NeonSessionManager;
