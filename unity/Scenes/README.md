HeartQuest Unity Scenes

This folder is where generated Unity scene files (.unity) will be saved.

Use the Unity Editor menu to generate demo scenes:

1. Copy the `unity/` folder from this repo into your Unity project at `Assets/HeartQuest/`.
2. In Unity, open the menu: Tools > HeartQuest > Generate Demo Scenes
3. This will create the following scenes in this folder:
   - ParadiseIsland.unity
   - NeonCity.unity
   - FantasyKingdom.unity

The scenes include:
- Main Camera
- Directional Light
- Large Plane ground
- `WorldSpawner` configured to the scene theme
- Capsule avatar with `Rigidbody` and `AvatarController`

If your project uses Version Control with .meta files, Unity will generate them automatically after the scenes are created.

