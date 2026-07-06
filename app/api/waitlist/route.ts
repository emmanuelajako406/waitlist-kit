import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

/**
 * ============================================================================
 * NOTION CLIENT
 * ============================================================================
 *
 * Creates a Notion client using the API key stored in the environment
 * variables. This client is used to create new pages inside a Notion database.
 */
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

/**
 * ============================================================================
 * POST /api/waitlist
 * ============================================================================
 *
 * Handles waitlist signups by:
 *
 * 1. Parsing the incoming request body.
 * 2. Validating the user's name and email.
 * 3. Verifying required environment variables exist.
 * 4. Creating a new page inside the configured Notion database.
 * 5. Returning a success or error response.
 *
 * Request Body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com"
 * }
 */
export async function POST(request: Request) {
  try {
    /**
     * ------------------------------------------------------------------------
     * Parse Request Body
     * ------------------------------------------------------------------------
     */
    const { email, name } = await request.json();

    /**
     * ------------------------------------------------------------------------
     * Validate Email
     * ------------------------------------------------------------------------
     *
     * Ensures an email was provided and contains a basic "@" check.
     * For production applications, consider using a validation library
     * such as Zod or validator.js.
     */
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    /**
     * ------------------------------------------------------------------------
     * Validate Name
     * ------------------------------------------------------------------------
     *
     * Prevents empty or whitespace-only names from being submitted.
     */
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    /**
     * ------------------------------------------------------------------------
     * Get Notion Database ID
     * ------------------------------------------------------------------------
     *
     * Retrieves the database ID from the environment variables.
     * If missing, the server is not properly configured.
     */
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      return NextResponse.json(
        {
          error: "Server configuration error. Missing Notion environment variables.",
        },
        { status: 500 }
      );
    }

    /**
     * ------------------------------------------------------------------------
     * Create Notion Page
     * ------------------------------------------------------------------------
     *
     * Each waitlist signup is stored as a new page inside the configured
     * Notion database.
     *
     * Required database properties:
     *
     * - Name  (Title)
     * - Email (Email)
     * Names must match exactly in order to work 
     */
    await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Email: {
          email,
        },
      },
    });

    /**
     * ------------------------------------------------------------------------
     * Success Response
     * ------------------------------------------------------------------------
     */
    return NextResponse.json(
      {
        message: "Successfully joined the waitlist!",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    /**
     * ------------------------------------------------------------------------
     * Error Handling
     * ------------------------------------------------------------------------
     *
     * Logs the error for debugging purposes and returns a generic response
     * to the client.
     */
    console.error("Notion API Error:", error);

    return NextResponse.json(
      {
        error: error.message || "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}