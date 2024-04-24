// app/page.tsx

'use client';

import { useState, useEffect } from "react";
import styled from "styled-components";
import GuestbookForm from "./form";
import GuestbookEntries from "./visitors";
import { Header } from "./header";

interface GuestbookEntry {
  id: string;
  userName: string;
  message: string;
  timestamp: string;
  ip?: string;
  country?: string;
  city?: string;
}

const MainContainer = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  color: #333;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #333;
`;
const Subtitle = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
  color: #333;
`;

const Description = styled.h3`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
  color: #555;
`;

async function getGuestbookEntries() {
  try {
    const response = await fetch("/api/guestbook", { cache: "no-store" });
    if (response.ok) {
      const entries = await response.json();
      return entries;
    } else {
      console.error("Error fetching guestbook entries:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    return [];
  }
}

export default function Home() {
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);

  useEffect(() => {
    fetchGuestbookEntries();
  }, []);

  const fetchGuestbookEntries = async () => {
    try {
      const response = await fetch("/api/guestbook");
      if (response.ok) {
        const entries = await response.json();
        setGuestbookEntries(entries);
      } else {
        console.error("Error fetching guestbook entries:", response.status);
      }
    } catch (error) {
      console.error("Error fetching guestbook entries:", error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      await fetchGuestbookEntries();
    } catch (error) {
      console.error("Error updating guestbook entries:", error);
    }
  };

  return (
    <MainContainer>
      <Header />
      <Title>Welcome!</Title>
      <Subtitle>Leave a message that will be submitted to DynamoDB</Subtitle>
      <Description>Click the JSON button to see the full entry as it would appear in Dynamo.</Description>
      <GuestbookForm onSubmit={handleFormSubmit} />
      <GuestbookEntries entries={guestbookEntries} />
    </MainContainer>
  );
}