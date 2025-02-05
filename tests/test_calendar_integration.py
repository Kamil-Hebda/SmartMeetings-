import unittest
from unittest.mock import patch, MagicMock
from backend.services.calendar.calendar_integration import (
    add_event, prepare_event_data, list_events
)


class TestGoogleCalendar(unittest.TestCase):

    def test_prepare_event_data(self):
        """Test funkcji prepare_event_data."""
        data = prepare_event_data(
            summary="Meeting",
            location="Office",
            description="Discuss project",
            start_date={"dateTime": "2024-10-27T10:00:00-07:00", "timeZone": "America/Los_Angeles"},
            end_date={"dateTime": "2024-10-27T11:00:00-07:00", "timeZone": "America/Los_Angeles"},
            attendees=[{"email": "test@example.com"}],
            reminders={"useDefault": True}
        )

        self.assertEqual(data["summary"], "Meeting")
        self.assertEqual(data["location"], "Office")
        self.assertEqual(data["description"], "Discuss project")
        self.assertEqual(data["start"], {"dateTime": "2024-10-27T10:00:00-07:00", "timeZone": "America/Los_Angeles"})
        self.assertEqual(data["attendees"], [{"email": "test@example.com"}])

    @patch("backend.services.calendar.calendar_integration.build")
    def test_list_events(self, mock_build):
        """Test funkcji list_events z mockowaniem API Google."""
        mock_service = MagicMock()
        mock_build.return_value = mock_service
        mock_service.events.return_value.list.return_value.execute.return_value = {
            "items": [{"summary": "Test Event", "start": {"dateTime": "2024-10-27T10:00:00-07:00"}}]
        }

        events = list_events(mock_service)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["summary"], "Test Event")

    @patch("backend.services.calendar.calendar_integration.build")
    def test_add_event(self, mock_build):
        """Test dodawania wydarzenia do Google Calendar."""
        mock_service = MagicMock()
        mock_build.return_value = mock_service
        mock_event = {"htmlLink": "http://example.com/event"}
        mock_service.events.return_value.insert.return_value.execute.return_value = mock_event

        event_link = add_event(mock_service, {})
        self.assertEqual(event_link, "http://example.com/event")


if __name__ == "__main__":
    unittest.main()
