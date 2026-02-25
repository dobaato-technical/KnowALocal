"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Button from "./button";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  itemsPerPage?: number;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
}

export default function Table<T extends Record<string, any>>({
  columns,
  data,
  itemsPerPage = 10,
  onRowClick,
  emptyMessage = "No data available",
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full">
          {/* Table Header */}
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-sm font-semibold text-gray-900 ${
                    column.className || ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {currentData.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row, startIndex + index)}
                className={`transition-colors ${
                  onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 text-sm text-gray-700 ${
                      column.className || ""
                    }`}
                  >
                    {column.render
                      ? column.render(row[column.key as keyof T], row, index)
                      : row[column.key as keyof T]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4">
        {/* Info */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
          <span className="font-semibold">
            {Math.min(endIndex, data.length)}
          </span>{" "}
          of <span className="font-semibold">{data.length}</span> results
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
