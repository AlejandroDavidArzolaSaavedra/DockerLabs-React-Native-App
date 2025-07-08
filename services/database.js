import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { DATABASE_NAME } from '../config';

jest.mock('expo-sqlite');
jest.mock('expo-file-system');
jest.mock('expo-asset');

jest.mock('../services/database', () => {
  const actual = jest.requireActual('../services/database');
  
  return {
    ...actual,
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      let instance = {
        db: null,
        initialize: jest.fn(),
        getConnection: jest.fn(),
        withTransactionAsync: jest.fn(),
        withExclusiveTransactionAsync: jest.fn(),
        checkTableExists: jest.fn(),
        executeSchema: jest.fn()
      };
      
      instance.initialize.mockImplementation(async function() {
        this.db = {
          execAsync: jest.fn().mockResolvedValue(undefined),
          getFirstAsync: jest.fn().mockResolvedValue(null),
          withTransactionAsync: jest.fn(cb => cb()),
          withExclusiveTransactionAsync: jest.fn(cb => cb()),
        };
        return this.db;
      });
      
      instance.getConnection.mockImplementation(async function() {
        if (!this.db) {
          throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.db;
      });
      
      return instance;
    })
  };
});

describe('Database Class Implementation', () => {
  let dbInstance;
  let mockDb;

  beforeEach(() => {
    jest.clearAllMocks();
    
    const Database = require('../services/database').default;
    dbInstance = new Database();
    
    mockDb = {
      execAsync: jest.fn().mockResolvedValue(undefined),
      getFirstAsync: jest.fn().mockResolvedValue(null),
      withTransactionAsync: jest.fn(cb => cb()),
      withExclusiveTransactionAsync: jest.fn(cb => cb()),
    };
    
    dbInstance.initialize.mockResolvedValue(mockDb);
    dbInstance.db = mockDb;
  });

  describe('initialize()', () => {
    it('should open database with correct name', async () => {
      SQLite.openDatabaseAsync.mockResolvedValue(mockDb);
      await dbInstance.initialize();
      expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith(DATABASE_NAME);
    });

    it('should set optimal database settings', async () => {
      await dbInstance.initialize();
      
      expect(mockDb.execAsync).toHaveBeenCalledWith(expect.stringContaining('PRAGMA journal_mode = WAL'));
      expect(mockDb.execAsync).toHaveBeenCalledWith(expect.stringContaining('PRAGMA foreign_keys = ON'));
      expect(mockDb.execAsync).toHaveBeenCalledWith(expect.stringContaining('PRAGMA busy_timeout = 5000'));
    });

    it('should execute schema if tables dont exist', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce(null);
      const executeSchemaSpy = jest.spyOn(dbInstance, 'executeSchema').mockResolvedValue();
      
      await dbInstance.initialize();
      expect(executeSchemaSpy).toHaveBeenCalled();
    });

    it('should not execute schema if tables exist', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce({ name: 'VirtualMachines' });
      const executeSchemaSpy = jest.spyOn(dbInstance, 'executeSchema').mockResolvedValue();
      
      await dbInstance.initialize();
      expect(executeSchemaSpy).not.toHaveBeenCalled();
    });

    it('should return database instance', async () => {
      const result = await dbInstance.initialize();
      expect(result).toBe(mockDb);
    });
  });

  describe('getConnection()', () => {
    it('should return connection when initialized', async () => {
      await dbInstance.initialize();
      const result = await dbInstance.getConnection();
      expect(result).toBe(mockDb);
    });

    it('should throw error when not initialized', async () => {
      dbInstance.db = null;
      await expect(dbInstance.getConnection()).rejects.toThrow(
        'Database not initialized. Call initialize() first.'
      );
    });
  });

  describe('withTransactionAsync()', () => {
    it('should execute callback in transaction', async () => {
      await dbInstance.initialize();
      const callback = jest.fn();
      await dbInstance.withTransactionAsync(callback);
      expect(callback).toHaveBeenCalled();
      expect(mockDb.withTransactionAsync).toHaveBeenCalled();
    });
  });

  describe('withExclusiveTransactionAsync()', () => {
    it('should execute callback in exclusive transaction', async () => {
      await dbInstance.initialize();
      const callback = jest.fn();
      await dbInstance.withExclusiveTransactionAsync(callback);
      expect(callback).toHaveBeenCalled();
      expect(mockDb.withExclusiveTransactionAsync).toHaveBeenCalled();
    });
  });

  describe('checkTableExists()', () => {
    it('should return true when table exists', async () => {
      await dbInstance.initialize();
      mockDb.getFirstAsync.mockResolvedValueOnce({ name: 'TestTable' });
      const exists = await dbInstance.checkTableExists('TestTable');
      expect(exists).toBe(true);
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
        ['TestTable']
      );
    });

    it('should return false when table doesnt exist', async () => {
      await dbInstance.initialize();
      mockDb.getFirstAsync.mockResolvedValueOnce(null);
      const exists = await dbInstance.checkTableExists('NonExistentTable');
      expect(exists).toBe(false);
    });
  });

  describe('executeSchema()', () => {
    beforeEach(() => {
      // Mockear Asset y FileSystem para executeSchema
      Asset.loadAsync.mockResolvedValue([{ localUri: 'file://schema.sql' }]);
      FileSystem.readAsStringAsync.mockResolvedValue(`
        -- Comentario
        CREATE TABLE Test1 (id INTEGER);
        
        CREATE TABLE Test2 (name TEXT);
      `);
    });

    it('should load and execute schema SQL', async () => {
      await dbInstance.initialize();
      await dbInstance.executeSchema();
      
      expect(Asset.loadAsync).toHaveBeenCalled();
      expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith('file://schema.sql');
      expect(mockDb.execAsync).toHaveBeenCalledWith('CREATE TABLE Test1 (id INTEGER)');
      expect(mockDb.execAsync).toHaveBeenCalledWith('CREATE TABLE Test2 (name TEXT)');
    });

    it('should execute in exclusive transaction', async () => {
      await dbInstance.initialize();
      await dbInstance.executeSchema();
      expect(mockDb.withExclusiveTransactionAsync).toHaveBeenCalled();
    });

    it('should throw error if SQL file not found', async () => {
      Asset.loadAsync.mockResolvedValueOnce([{ localUri: null }]);
      await expect(dbInstance.executeSchema()).rejects.toThrow('SQL file not found');
    });

    it('should handle SQL execution errors', async () => {
      mockDb.execAsync.mockRejectedValueOnce(new Error('SQL error'));
      await expect(dbInstance.executeSchema()).rejects.toThrow('SQL error');
    });
  });

  it('should implement singleton pattern', () => {
    const Database = require('../services/database').default;
    const instance1 = new Database();
    const instance2 = new Database();
    expect(instance1).toBe(instance2);
  });
});

describe('Database Service Exports', () => {
  let mockDatabaseInstance;

  beforeEach(() => {
    mockDatabaseInstance = {
      initialize: jest.fn().mockResolvedValue({}),
      getConnection: jest.fn().mockResolvedValue({}),
      withTransactionAsync: jest.fn().mockImplementation(cb => cb()),
      withExclusiveTransactionAsync: jest.fn().mockImplementation(cb => cb()),
      checkTableExists: jest.fn().mockResolvedValue(false),
      executeSchema: jest.fn().mockResolvedValue(),
    };

    jest.mock('../services/database', () => ({
      __esModule: true,
      default: mockDatabaseInstance,
      initialize: mockDatabaseInstance.initialize,
      getConnection: mockDatabaseInstance.getConnection,
      withTransactionAsync: mockDatabaseInstance.withTransactionAsync,
      withExclusiveTransactionAsync: mockDatabaseInstance.withExclusiveTransactionAsync,
      checkTableExists: mockDatabaseInstance.checkTableExists,
      executeSchema: mockDatabaseInstance.executeSchema,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('initialize export calls instance method', async () => {
    const { initialize } = require('../services/database');
    await initialize();
    expect(mockDatabaseInstance.initialize).toHaveBeenCalled();
  });

  test('getConnection export calls instance method', async () => {
    const { getConnection } = require('../services/database');
    await getConnection();
    expect(mockDatabaseInstance.getConnection).toHaveBeenCalled();
  });

  test('withTransactionAsync export calls instance method', async () => {
    const { withTransactionAsync } = require('../services/database');
    const callback = jest.fn();
    await withTransactionAsync(callback);
    expect(mockDatabaseInstance.withTransactionAsync).toHaveBeenCalledWith(callback);
  });

  test('withExclusiveTransactionAsync export calls instance method', async () => {
    const { withExclusiveTransactionAsync } = require('../services/database');
    const callback = jest.fn();
    await withExclusiveTransactionAsync(callback);
    expect(mockDatabaseInstance.withExclusiveTransactionAsync).toHaveBeenCalledWith(callback);
  });

  test('checkTableExists export calls instance method', async () => {
    const { checkTableExists } = require('../services/database');
    await checkTableExists('TestTable');
    expect(mockDatabaseInstance.checkTableExists).toHaveBeenCalledWith('TestTable');
  });

  test('executeSchema export calls instance method', async () => {
    const { executeSchema } = require('../services/database');
    await executeSchema();
    expect(mockDatabaseInstance.executeSchema).toHaveBeenCalled();
  });
});