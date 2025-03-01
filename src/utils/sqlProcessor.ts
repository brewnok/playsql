import alasql from 'alasql';
import { TableData, QueryResult } from '../types';

export const initializeDatabase = (tables: TableData[]): void => {
  // Drop existing tables to avoid conflicts
  tables.forEach(table => {
    try {
      alasql(`DROP TABLE IF EXISTS ${table.name}`);
    } catch (error) {
      console.error(`Error dropping table ${table.name}:`, error);
    }
  });

  // Create tables with the data
  tables.forEach(table => {
    try {
      // Create table
      alasql(`CREATE TABLE ${table.name}`);
      
      // Insert data
      if (table.data.length > 0) {
        alasql.tables[table.name].data = table.data;
      }
    } catch (error) {
      console.error(`Error creating table ${table.name}:`, error);
    }
  });
};

export const executeQuery = (query: string): QueryResult => {
  try {
    // Execute the query
    const data = alasql(query);
    
    // Extract column names from the first row
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    
    return { data, columns };
  } catch (error) {
    return {
      data: [],
      columns: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};