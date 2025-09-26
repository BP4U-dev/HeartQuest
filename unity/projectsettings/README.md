HeartQuest Unity ProjectSettings

Unity creates and manages files in this folder automatically (YAML `.asset` files like `ProjectSettings.asset`, `InputManager.asset`, `TagManager.asset`, etc.).

Recommended workflow:
- Open the Unity project (copy `unity/` into `Assets/HeartQuest/` in your Unity project).
- Edit settings via Unity menus (Edit > Project Settings...).
- Unity will write the actual settings files into `ProjectSettings/` at the project root.

Notes:
- This repo includes this folder only as a placeholder for organization; actual ProjectSettings are per-Unity-project and version-specific.
- Use Unity Collaborate or Git with meta files enabled to track generated settings in your project.

