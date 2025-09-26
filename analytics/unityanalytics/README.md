Unity Analytics (Optional)

If you use the Unity player or a Unity-based companion app, enable Unity Analytics in the Unity Editor:

1. Window > Package Manager > install/enable Unity Analytics (or UGS Analytics).
2. Services > Analytics: link your project and enable data collection.
3. Use `AnalyticsService.Instance.CustomData("eventName", dataDict);` in C#.

Web ↔ Unity
- For a consistent data pipeline, mirror critical events to your web analytics (see `analytics/events.js`).
- Consider sending event summaries to your backend for centralized reporting.

