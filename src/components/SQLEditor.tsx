import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { Play, Save, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

// Import ace modes and themes
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

interface SQLEditorProps {
  onRunQuery: (query: string) => void;
  isProcessing: boolean;
}

const SQLEditor: React.FC<SQLEditorProps> = ({ onRunQuery, isProcessing }) => {
  const [query, setQuery] = useState<string>('SELECT * FROM table1 LIMIT 10');
  const [savedQueries, setSavedQueries] = useState<string[]>([]);

  const handleRunQuery = () => {
    if (!query.trim()) {
      toast.error('Please enter a SQL query');
      return;
    }
    onRunQuery(query);
  };

  const handleSaveQuery = () => {
    if (!query.trim()) {
      toast.error('Cannot save empty query');
      return;
    }
    setSavedQueries([...savedQueries, query]);
    toast.success('Query saved');
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query)
      .then(() => toast.success('Query copied to clipboard'))
      .catch(() => toast.error('Failed to copy query'));
  };

  const loadSavedQuery = (savedQuery: string) => {
    setQuery(savedQuery);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-medium text-gray-800">SQL Editor</h2>
        <p className="text-sm text-gray-500">
          Write your SQL query to analyze the uploaded data
        </p>
      </div>
      
      <div className="p-4">
        <AceEditor
          mode="sql"
          theme="github"
          name="sql-editor"
          fontSize={14}
          width="100%"
          height="200px"
          value={query}
          onChange={setQuery}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
          className="border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={handleRunQuery}
            disabled={isProcessing}
            className={`flex items-center px-4 py-2 rounded-md text-white ${
              isProcessing ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            } transition-colors`}
          >
            <Play className="h-4 w-4 mr-2" />
            {isProcessing ? 'Running...' : 'Run Query'}
          </button>
          
          <button
            onClick={handleSaveQuery}
            className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
          
          <button
            onClick={handleCopyQuery}
            className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </button>
        </div>
        
        {savedQueries.length > 0 && (
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Saved:</span>
            <select
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              onChange={(e) => loadSavedQuery(e.target.value)}
              value=""
            >
              <option value="" disabled>
                Select a saved query
              </option>
              {savedQueries.map((savedQuery, index) => (
                <option key={index} value={savedQuery}>
                  {savedQuery.length > 30
                    ? `${savedQuery.substring(0, 30)}...`
                    : savedQuery}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SQLEditor;