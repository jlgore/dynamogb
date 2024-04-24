// app/api/guestbook/route.ts

'use server';

import { Resource } from "sst";
import { NextResponse } from 'next/server';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();
const tableName = Resource.GuestbookEntries.name;
const IPINFO_TOKEN = Resource.IPInfoToken.value;

interface GuestbookEntry {
  id: string;
  userName: string;
  message: string;
  timestamp: string;
  ip?: string;
  country?: string;
  city?: string;
}

const runtime = 'nodejs';
const dynamic = 'force-dynamic';

const fetchEntries = async () => {
  const params = {
    TableName: tableName,
  };
  const result = await dynamodb.scan(params).promise();
  return result.Items;
};

export async function GET(request: Request) {
  try {
    const entries = await fetchEntries();
    
    // Remove the 'ip' property from each entry before sending the response
    const entriesWithoutIp = entries!.map(({ ip, ...rest }) => rest);
    
    return NextResponse.json(entriesWithoutIp);
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    return NextResponse.json({ error: "Failed to fetch guestbook entries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { userName, message } = requestBody;

    const ip = request.headers.get('X-Forwarded-For') || request.headers.get('x-real-ip');

    let geo = null;
    if (ip) {
      try {
        const response = await fetch(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
        geo = await response.json();
      } catch (error) {
        console.error('Error retrieving geolocation information:', error);
      }
    }

    const { country, city } = geo || {};
    const timestamp = new Date().toISOString();

    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: tableName,
      Item: {
        id: timestamp,
        noteId: timestamp,
        userName,
        message,
        timestamp,
        ip,
        country,
        city,
      } as GuestbookEntry,
    };

    await dynamodb.put(params).promise();
    console.log('Successfully saved guestbook entry to DynamoDB');

    const newEntry = params.Item;
    
    // Remove the 'ip' property from the new entry before sending the response
    const { ip: _, ...newEntryWithoutIp } = newEntry;
    
    return NextResponse.json({ type: 'new-entry', entry: newEntryWithoutIp }, { status: 200 });
  } catch (error) {
    console.error('Error saving guestbook entry:', error);
    return NextResponse.json({ error: 'Failed to save guestbook entry' }, { status: 500 });
  }
}