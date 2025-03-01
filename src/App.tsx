import React, { useState, useEffect } from 'react';
import { Database, FileSpreadsheet, Code2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import FileUploader from './components/FileUploader';
import SQLEditor from './components/SQLEditor';
import ResultsTable from './components/ResultsTable';
import TablesList from './components/TablesList';
import { TableData, QueryResult } from './types';
import { initializeDatabase, executeQuery } from './utils/sqlProcessor';
import playsqllogo from './images/playsqllogo.png'
import footerimg from './images/footerimage.png'

function App() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize the database whenever tables change
  useEffect(() => {
    if (tables.length > 0) {
      initializeDatabase(tables);
    }
  }, [tables]);

  const handleFileProcessed = (tableData: TableData) => {
    // Check if a table with the same name already exists
    const existingTableIndex = tables.findIndex(t => t.name === tableData.name);
    
    if (existingTableIndex >= 0) {
      // Replace the existing table
      const updatedTables = [...tables];
      updatedTables[existingTableIndex] = tableData;
      setTables(updatedTables);
    } else {
      // Add new table
      setTables([...tables, tableData]);
    }
  };

  const handleRemoveTable = (tableName: string) => {
    setTables(tables.filter(table => table.name !== tableName));
  };

  const handleRunQuery = (query: string) => {
    setIsProcessing(true);
    
    // Small delay to allow UI to update
    setTimeout(() => {
      try {
        const results = executeQuery(query);
        setQueryResults(results);
      } catch (error) {
        setQueryResults({
          data: [],
          columns: [],
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
    

      <header className="bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex items-center justify-center"> {/* Centering the content */}
      <div>

        <img src={playsqllogo} alt="SQL Playground Logo" className="h-[70px] w-auto" /> {/* Display logo */}
      </div>
    </div>
  </div>
</header>
      
      {/* Main Content */}
      <main className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FileSpreadsheet className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-800">Upload Data</h2>
              </div>
              <FileUploader onFileProcessed={handleFileProcessed} />
            </div>
            
            <TablesList tables={tables} onRemoveTable={handleRemoveTable} />
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Code2 className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-800">SQL Query</h2>
              </div>
              <SQLEditor onRunQuery={handleRunQuery} isProcessing={isProcessing} />
            </div>
            
            <ResultsTable results={queryResults} />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-12 fixed bottom-0 left-0 right-0">
  <div className="bg-gray-50 px-6 py-4 flex items-center justify-center">
    <img src={footerimg} alt="Logo" className="h-auto w-[200px] mr-2" />
  </div>
</footer>
    </div>
  );
}

export default App;