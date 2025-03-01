import React from 'react';
import { Database, Table2, X } from 'lucide-react';
import { TableData } from '../types';

interface TablesListProps {
  tables: TableData[];
  onRemoveTable: (tableName: string) => void;
}

const TablesList: React.FC<TablesListProps> = ({ tables, onRemoveTable }) => {
  if (tables.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <Database className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">No tables loaded</h3>
          <p className="text-sm text-gray-500 mt-1">
            Upload a CSV or Excel file to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-medium text-gray-800">Available Tables</h2>
        <p className="text-sm text-gray-500">
          Use these table names in your SQL queries
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {tables.map((table) => (
          <li key={table.name} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-md mr-3">
                  <Table2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-800">{table.name}</h3>
                  <p className="text-sm text-gray-500">
                    {table.data.length} rows, {table.columns.length} columns
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemoveTable(table.name)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove table"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-1">Columns:</div>
              <div className="flex flex-wrap gap-1">
                {table.columns.map((column) => (
                  <span
                    key={column}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {column}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TablesList;