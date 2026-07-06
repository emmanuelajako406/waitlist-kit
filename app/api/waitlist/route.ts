import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

// Initialize the official Notion SDK client
const notion = new Client({ auth: process.env.NOTION_SECRET });

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }
  
    // Insert a new row into the Notion Database
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        // "Email" must match the precise column name in your Notion table
        Email: {
          email: email,
        },
        Country: {
            select: { name: 'Fake' },
          }, 
         },
    });

    return NextResponse.json({ message: 'Successfully joined the waitlist!' }, { status: 200 });
  } catch (error: any) {
    console.error('Notion API Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong.' }, { status: 500 });
  }
}