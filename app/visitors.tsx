// app/visitors.tsx

'use client';

import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface GuestbookEntry {
  id: string;
  userName: string;
  message: string;
  timestamp: string;
  ip?: string;
  country?: string;
  city?: string;
}

interface GuestbookEntriesProps {
  entries: GuestbookEntry[];
}

const EntriesContainer = styled.div`
  margin-top: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  user-select: none;
  color: #333;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  color: #333;
`;

const ShowJsonButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }
`;

const JsonModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const JsonModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
`;

const CloseButton = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 14px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #c82333;
  }
`;

const GuestbookEntries: React.FC<GuestbookEntriesProps> = ({ entries }) => {
  const [sortKey, setSortKey] = useState<keyof GuestbookEntry>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortedEntries, setSortedEntries] = useState<GuestbookEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<GuestbookEntry | null>(null);

  useEffect(() => {
    const sorted = [...entries].sort((a, b) => {
      if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
      if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setSortedEntries(sorted);
  }, [entries, sortKey, sortOrder]);

  const handleSort = (key: keyof GuestbookEntry) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleShowJson = (entry: GuestbookEntry) => {
    setSelectedEntry(entry);
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
  };

  return (
    <EntriesContainer>
      <Title>Guestbook Entries</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader onClick={() => handleSort("userName")}>User Name</TableHeader>
            <TableHeader onClick={() => handleSort("message")}>Message</TableHeader>
            <TableHeader onClick={() => handleSort("country")}>Country</TableHeader>
            <TableHeader onClick={() => handleSort("city")}>City</TableHeader>
            <TableHeader onClick={() => handleSort("timestamp")}>Timestamp</TableHeader>
            <TableHeader>JSON</TableHeader>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.userName}</TableCell>
              <TableCell>{entry.message}</TableCell>
              <TableCell>{entry.country || '❓'}</TableCell>
              <TableCell>{entry.city || '❓'}</TableCell>
              <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
              <TableCell>
                <ShowJsonButton onClick={() => handleShowJson(entry)}>Raw JSON</ShowJsonButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      {selectedEntry && (
        <JsonModal>
          <JsonModalContent>
            <pre>{JSON.stringify(selectedEntry, null, 2)}</pre>
            <CloseButton onClick={handleCloseModal}>Close</CloseButton>
          </JsonModalContent>
        </JsonModal>
      )}
    </EntriesContainer>
  );
};

export default GuestbookEntries;