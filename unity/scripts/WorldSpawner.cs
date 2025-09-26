using UnityEngine;

namespace HeartQuest
{
    public class WorldSpawner : MonoBehaviour
    {
        [Header("Prefabs")]
        public GameObject paradisePalmPrefab;
        public GameObject neonBuildingPrefab;
        public GameObject fantasyTreePrefab;

        [Header("Counts")]
        public int palms = 10;
        public int buildings = 20;
        public int trees = 15;

        [Header("Bounds")]
        public float radius = 50f;

        public enum WorldType { Paradise, City, Fantasy }
        public WorldType currentWorld = WorldType.Paradise;

        void Start()
        {
            SpawnWorld();
        }

        [ContextMenu("SpawnWorld")]
        public void SpawnWorld()
        {
            ClearChildren();
            switch (currentWorld)
            {
                case WorldType.Paradise:
                    SpawnPalms();
                    break;
                case WorldType.City:
                    SpawnBuildings();
                    break;
                case WorldType.Fantasy:
                    SpawnTrees();
                    break;
            }
        }

        private void ClearChildren()
        {
            for (int i = transform.childCount - 1; i >= 0; i--)
            {
                DestroyImmediate(transform.GetChild(i).gameObject);
            }
        }

        private void SpawnPalms()
        {
            for (int i = 0; i < palms; i++)
            {
                Vector3 pos = Random.insideUnitSphere * radius;
                pos.y = 0f;
                if (paradisePalmPrefab != null)
                {
                    Instantiate(paradisePalmPrefab, pos, Quaternion.Euler(0f, Random.Range(0f, 360f), 0f), transform);
                }
                else
                {
                    // Fallback primitive palm: cylinder trunk + sphere leaves
                    var trunk = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                    trunk.transform.SetParent(transform);
                    trunk.transform.position = pos + new Vector3(0f, 1.5f, 0f);
                    trunk.transform.localScale = new Vector3(0.2f, 1.5f, 0.2f);
                    var trunkRenderer = trunk.GetComponent<Renderer>();
                    if (trunkRenderer) trunkRenderer.material.color = new Color(0.545f, 0.271f, 0.075f);

                    var leaves = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                    leaves.transform.SetParent(transform);
                    leaves.transform.position = pos + new Vector3(0f, 3.0f, 0f);
                    leaves.transform.localScale = new Vector3(1.6f, 0.6f, 1.6f);
                    var leavesRenderer = leaves.GetComponent<Renderer>();
                    if (leavesRenderer) leavesRenderer.material.color = new Color(0.133f, 0.545f, 0.133f);
                }
            }
        }

        private void SpawnBuildings()
        {
            for (int i = 0; i < buildings; i++)
            {
                Vector3 pos = Random.insideUnitSphere * radius;
                pos.y = 0f;
                if (neonBuildingPrefab != null)
                {
                    Instantiate(neonBuildingPrefab, pos, Quaternion.identity, transform);
                }
                else
                {
                    // Fallback primitive building: box with emissive-like bright color
                    var building = GameObject.CreatePrimitive(PrimitiveType.Cube);
                    building.transform.SetParent(transform);
                    float h = Random.Range(5f, 20f);
                    building.transform.localScale = new Vector3(Random.Range(1f, 4f), h, Random.Range(1f, 4f));
                    building.transform.position = pos + new Vector3(0f, h * 0.5f, 0f);
                    var mr = building.GetComponent<Renderer>();
                    if (mr)
                    {
                        var c = Color.HSVToRGB(Random.value, 0.8f, 1f);
                        mr.material.color = c;
                    }
                }
            }
        }

        private void SpawnTrees()
        {
            for (int i = 0; i < trees; i++)
            {
                Vector3 pos = Random.insideUnitSphere * radius;
                pos.y = 0f;
                if (fantasyTreePrefab != null)
                {
                    Instantiate(fantasyTreePrefab, pos, Quaternion.identity, transform);
                }
                else
                {
                    // Fallback primitive fantasy tree: cylinder + colored sphere
                    var trunk = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                    trunk.transform.SetParent(transform);
                    trunk.transform.position = pos + new Vector3(0f, 2f, 0f);
                    trunk.transform.localScale = new Vector3(0.3f, 2f, 0.3f);

                    var crown = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                    crown.transform.SetParent(transform);
                    crown.transform.position = pos + new Vector3(0f, 4.5f, 0f);
                    crown.transform.localScale = new Vector3(2f, 2f, 2f);
                    var mr = crown.GetComponent<Renderer>();
                    if (mr)
                    {
                        var c = Color.HSVToRGB(Random.value, 0.6f, 1f);
                        mr.material.color = c;
                    }
                }
            }
        }
    }
}


