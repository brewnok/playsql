import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { TableData } from '../types';

interface FileUploaderProps {
  onFileProcessed: (tableData: TableData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileProcessed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    const fileName = file.name.split('.')[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    try {
      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              const columns = Object.keys(results.data[0]);
              onFileProcessed({
                name: fileName,
                data: results.data,
                columns
              });
              toast.success(`CSV file "${fileName}" loaded successfully`);
            } else {
              toast.error('The CSV file appears to be empty or invalid');
            }
            setIsProcessing(false);
          },
          error: (error) => {
            toast.error(`Error parsing CSV: ${error.message}`);
            setIsProcessing(false);
          }
        });
      } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData && jsonData.length > 0) {
          const columns = Object.keys(jsonData[0]);
          onFileProcessed({
            name: fileName,
            data: jsonData,
            columns
          });
          toast.success(`Excel file "${fileName}" loaded successfully`);
        } else {
          toast.error('The Excel file appears to be empty or invalid');
        }
        setIsProcessing(false);
      } else {
        toast.error('Unsupported file format. Please upload CSV or Excel files.');
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-3 bg-blue-100 rounded-full">
          {isProcessing ? (
            <div className="animate-spin">
              <FileSpreadsheet className="h-8 w-8 text-blue-500" />
            </div>
          ) : (
            <Upload className="h-8 w-8 text-blue-500" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700">
            {isProcessing ? 'Processing file...' : 'Upload your data file'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Drag and drop your CSV or Excel file, or click to browse
          </p>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>Supported formats: CSV, XLSX, XLS</span>
        </div>
        <label className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-colors">
          Browse Files
          <input
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </label>
      </div>
    </div>
  );
};

export default FileUploader;