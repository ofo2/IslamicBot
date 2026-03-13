import NeonManager from './NeonManager.mjs';

/**
 * NeonTableManager class for managing tables in the Neon database.
 * Tables are already created via migration, this is for compatibility.
 */
class NeonTableManager {
    constructor() {
        this.dbManager = new NeonManager();
    }

    /**
     * Initialize tables - tables are pre-created via SQL migration
     */
    async initializeTables() {
        console.log("NeonTableManager: Tables already initialized via migration.");
    }
}

export default NeonTableManager;
