// This script generates playable demo scenes in the Unity Editor.
// Copy the entire `unity/` folder into your Unity project's `Assets/HeartQuest/` folder.
// Then, in Unity, use the menu: Tools > HeartQuest > Generate Demo Scenes

#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace HeartQuest.EditorTools
{
    public static class SceneGenerator
    {
        private const string ScenesFolder = "Assets/HeartQuest/Scenes";

        [MenuItem("Tools/HeartQuest/Generate Demo Scenes")]
        public static void GenerateAllScenes()
        {
            EnsureFolders();
            CreateScene("ParadiseIsland", WorldSpawner.WorldType.Paradise);
            CreateScene("NeonCity", WorldSpawner.WorldType.City);
            CreateScene("FantasyKingdom", WorldSpawner.WorldType.Fantasy);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            EditorUtility.DisplayDialog("HeartQuest", "Demo scenes generated in " + ScenesFolder, "OK");
        }

        private static void EnsureFolders()
        {
            CreateFolderIfNotExists("Assets/HeartQuest");
            CreateFolderIfNotExists(ScenesFolder);
        }

        private static void CreateFolderIfNotExists(string path)
        {
            if (!AssetDatabase.IsValidFolder(path))
            {
                var parent = System.IO.Path.GetDirectoryName(path).Replace('\\', '/');
                var leaf = System.IO.Path.GetFileName(path);
                if (!string.IsNullOrEmpty(parent) && AssetDatabase.IsValidFolder(parent))
                {
                    AssetDatabase.CreateFolder(parent, leaf);
                }
            }
        }

        private static void CreateScene(string sceneName, WorldSpawner.WorldType worldType)
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            scene.name = sceneName;

            // Camera
            var camGo = new GameObject("Main Camera");
            var cam = camGo.AddComponent<Camera>();
            camGo.tag = "MainCamera";
            cam.clearFlags = CameraClearFlags.Skybox;
            cam.transform.position = new Vector3(0f, 6f, -10f);
            cam.transform.rotation = Quaternion.Euler(15f, 0f, 0f);

            // Light
            var lightGo = new GameObject("Directional Light");
            var light = lightGo.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1.1f;
            light.transform.rotation = Quaternion.Euler(50f, -30f, 0f);

            // Ground
            var ground = GameObject.CreatePrimitive(PrimitiveType.Plane);
            ground.name = "Ground";
            ground.transform.localScale = new Vector3(10f, 1f, 10f);
            var groundMr = ground.GetComponent<Renderer>();
            if (groundMr) groundMr.sharedMaterial.color = new Color(0.25f, 0.25f, 0.25f);

            // World Spawner
            var spawnerGo = new GameObject("WorldSpawner");
            var spawner = spawnerGo.AddComponent<HeartQuest.WorldSpawner>();
            spawner.currentWorld = worldType;
            spawner.radius = 50f;

            // Avatar
            var avatarGo = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            avatarGo.name = "Avatar";
            avatarGo.transform.position = new Vector3(0f, 1.1f, 0f);
            var rb = avatarGo.AddComponent<Rigidbody>();
            rb.constraints = RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationZ;
            avatarGo.AddComponent<HeartQuest.AvatarController>();

            // Save scene
            string path = $"{ScenesFolder}/{sceneName}.unity";
            EditorSceneManager.SaveScene(scene, path, true);
        }
    }
}
#endif


