#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System.IO;

namespace HeartQuest.EditorTools
{
    public static class AssetGenerator
    {
        private const string RootFolder = "Assets/HeartQuest/Generated";

        [MenuItem("Tools/HeartQuest/Generate Assets (Materials & Prefabs)")]
        public static void GenerateAssets()
        {
            EnsureFolders();

            // Create basic materials
            var sandMat = CreateMaterial("Sand", new Color(0.96f, 0.89f, 0.74f));
            var waterMat = CreateMaterial("Water", new Color(0.0f, 0.41f, 0.58f), metallic: 0.2f, smoothness: 0.8f);
            var leafMat = CreateMaterial("Leaf", new Color(0.13f, 0.55f, 0.13f));
            var woodMat = CreateMaterial("Wood", new Color(0.55f, 0.27f, 0.07f), metallic: 0.0f, smoothness: 0.4f);
            var neonMat = CreateMaterial("Neon", Color.magenta, emission: new Color(1f, 0f, 1f));

            // Create simple prefabs using primitives
            CreatePalmPrefab(woodMat, leafMat);
            CreateNeonBuildingPrefab(neonMat);
            CreateFantasyTreePrefab(woodMat, leafMat);

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            EditorUtility.DisplayDialog("HeartQuest", "Generated materials and prefabs under " + RootFolder, "OK");
        }

        private static void EnsureFolders()
        {
            CreateFolderIfNotExists("Assets/HeartQuest");
            CreateFolderIfNotExists(RootFolder);
            CreateFolderIfNotExists(Path.Combine(RootFolder, "Materials").Replace('\\','/'));
            CreateFolderIfNotExists(Path.Combine(RootFolder, "Prefabs").Replace('\\','/'));
        }

        private static void CreateFolderIfNotExists(string path)
        {
            if (!AssetDatabase.IsValidFolder(path))
            {
                var parent = Path.GetDirectoryName(path).Replace('\\', '/');
                var leaf = Path.GetFileName(path);
                if (!string.IsNullOrEmpty(parent) && AssetDatabase.IsValidFolder(parent))
                {
                    AssetDatabase.CreateFolder(parent, leaf);
                }
            }
        }

        private static Material CreateMaterial(string name, Color color, float metallic = 0.0f, float smoothness = 0.5f, Color? emission = null)
        {
            var shader = Shader.Find("Standard");
            var mat = new Material(shader);
            mat.color = color;
            mat.SetFloat("_Metallic", metallic);
            mat.SetFloat("_Glossiness", smoothness);
            if (emission.HasValue)
            {
                mat.EnableKeyword("_EMISSION");
                mat.SetColor("_EmissionColor", emission.Value);
            }
            var path = $"{RootFolder}/Materials/{name}.mat";
            AssetDatabase.CreateAsset(mat, path);
            return AssetDatabase.LoadAssetAtPath<Material>(path);
        }

        private static void CreatePalmPrefab(Material trunkMat, Material leafMat)
        {
            var root = new GameObject("Palm");

            var trunk = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            trunk.name = "Trunk";
            trunk.transform.SetParent(root.transform);
            trunk.transform.localPosition = new Vector3(0, 1.5f, 0);
            trunk.transform.localScale = new Vector3(0.2f, 1.5f, 0.2f);
            var trunkMr = trunk.GetComponent<Renderer>();
            if (trunkMr) trunkMr.sharedMaterial = trunkMat;

            var leaves = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            leaves.name = "Leaves";
            leaves.transform.SetParent(root.transform);
            leaves.transform.localPosition = new Vector3(0, 3.0f, 0);
            leaves.transform.localScale = new Vector3(1.6f, 0.6f, 1.6f);
            var leavesMr = leaves.GetComponent<Renderer>();
            if (leavesMr) leavesMr.sharedMaterial = leafMat;

            var prefabPath = $"{RootFolder}/Prefabs/Palm.prefab";
            SavePrefab(root, prefabPath);
        }

        private static void CreateNeonBuildingPrefab(Material neonMat)
        {
            var root = new GameObject("NeonBuilding");
            var cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
            cube.transform.SetParent(root.transform);
            float h = Random.Range(6f, 16f);
            cube.transform.localScale = new Vector3(Random.Range(1.2f, 3.5f), h, Random.Range(1.2f, 3.5f));
            cube.transform.localPosition = new Vector3(0, h * 0.5f, 0);
            var mr = cube.GetComponent<Renderer>();
            if (mr) mr.sharedMaterial = neonMat;

            var prefabPath = $"{RootFolder}/Prefabs/NeonBuilding.prefab";
            SavePrefab(root, prefabPath);
        }

        private static void CreateFantasyTreePrefab(Material trunkMat, Material leafMat)
        {
            var root = new GameObject("FantasyTree");

            var trunk = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            trunk.name = "Trunk";
            trunk.transform.SetParent(root.transform);
            trunk.transform.localPosition = new Vector3(0, 2.0f, 0);
            trunk.transform.localScale = new Vector3(0.3f, 2.0f, 0.3f);
            var trunkMr = trunk.GetComponent<Renderer>();
            if (trunkMr) trunkMr.sharedMaterial = trunkMat;

            var crown = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            crown.name = "Crown";
            crown.transform.SetParent(root.transform);
            crown.transform.localPosition = new Vector3(0, 4.5f, 0);
            crown.transform.localScale = new Vector3(2.0f, 2.0f, 2.0f);
            var crownMr = crown.GetComponent<Renderer>();
            if (crownMr) crownMr.sharedMaterial = leafMat;

            var prefabPath = $"{RootFolder}/Prefabs/FantasyTree.prefab";
            SavePrefab(root, prefabPath);
        }

        private static void SavePrefab(GameObject root, string path)
        {
            var folder = Path.GetDirectoryName(path).Replace('\\','/');
            if (!AssetDatabase.IsValidFolder(folder))
            {
                var parent = Path.GetDirectoryName(folder).Replace('\\','/');
                var leaf = Path.GetFileName(folder);
                if (AssetDatabase.IsValidFolder(parent))
                {
                    AssetDatabase.CreateFolder(parent, leaf);
                }
            }
            PrefabUtility.SaveAsPrefabAsset(root, path);
            Object.DestroyImmediate(root);
        }
    }
}
#endif


