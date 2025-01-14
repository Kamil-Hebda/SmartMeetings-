import datetime
import os.path
import logging
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.errors import HttpError
import os
from dotenv import load_dotenv
SCOPES = ["https://www.googleapis.com/auth/calendar"]

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
REDIRECT_URI = os.getenv("REDIRECT_URI")
TOKEN_URI = os.getenv("TOKEN_URI")
AUTH_URI = os.getenv("AUTH_URI")

def authenticate_google_calendar():
    creds = None
    try:
        if os.path.exists("token.json"):
            creds = Credentials.from_authorized_user_file("token.json", SCOPES)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_config(
                    {
                        "installed": {
                            "client_id": CLIENT_ID,
                            "project_id": "smartmeetingscalendar",
                            "auth_uri": AUTH_URI,
                            "token_uri": TOKEN_URI,
                            "client_secret": CLIENT_SECRET,
                            "redirect_uris": [REDIRECT_URI],
                        }
                    },
                    SCOPES,
                )
                creds = flow.run_local_server(port=0)

            with open("token.json", "w") as token:
                token.write(creds.to_json())

        return build("calendar", "v3", credentials=creds)

    except Exception as e:
        logging.error(f"Error authenticating Google Calendar: {e}", exc_info=True)
        return None

def add_event(service, event_data, calendar_id="primary"):
    """Add an event to the user's Google Calendar."""
    if not service:
        return None

    try:
        event = service.events().insert(calendarId=calendar_id, body=event_data).execute()
        return event.get('htmlLink')  # Return the event link
    except HttpError as error:
        print(f"An error occurred: {error}")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def prepare_event_data(summary, location, description, start_date, end_date, attendees, reminders):
    """Prepare event data for Google Calendar API."""
    return {
        "summary": summary,
        "location": location,
        "description": description,
        "start": start_date,
        "end": end_date,
        "attendees": attendees,
        "reminders": reminders,
    }


def list_events(service):
  if not service:
      return [] 

  now = datetime.datetime.utcnow().isoformat() + "Z" # Use UTC
  events_result = (
      service.events()
      .list(
          calendarId="primary",
          timeMin=now,
          maxResults=10,
          singleEvents=True,
          orderBy="startTime",
      )
      .execute()
  )
  events = events_result.get("items", [])
  return events

if __name__ == '__main__':
    service = authenticate_google_calendar()
    if service:
        event_data = prepare_event_data(
            summary="Important Meeting",
            start_date={"dateTime": "2024-10-27T10:00:00-07:00", "timeZone": "America/Los_Angeles"},
            end_date={"dateTime": "2024-10-27T11:00:00-07:00", "timeZone": "America/Los_Angeles"},
            location="Conference Room A",
            description="Project update",
            attendees=[{"email": "your_email@example.com"}],
            reminders={"useDefault": True}
        )
        event_link = add_event(service, event_data)
        if event_link:
            print(f"Event created successfully: {event_link}")
        else:
            print(f"Failed to create event. Error: {event_link}")
    else:
        print("Calendar authentication failed.")

list_events(authenticate_google_calendar())
