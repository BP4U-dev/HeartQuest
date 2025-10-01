using System;
using System.Collections.Generic;
using System.Diagnostics;
using UnityEngine;

namespace HeartQuest
{
    public class RealisticSceneGenerator : MonoBehaviour
    {
        [Header("Scene Settings")]
        public int sceneSize = 50;
        public SceneType currentSceneType = SceneType.RomanticPark;

        [Header("Generated Objects")]
        public List<GameObject> generatedObjects = new List<GameObject>();

        public enum SceneType
        {
            RomanticPark,
            CozyBeach,
            CityDate,
            FantasyGarden,
            MountainRetreat,
            ModernCafe
        }

        [ContextMenu("Generate Complete Scene")]
        public void GenerateCompleteScene()
        {
            ClearCurrentScene();
            CreateEnvironmentBase();

            switch (currentSceneType)
            {
                case SceneType.RomanticPark:
                    CreateRomanticPark();
                    break;
                case SceneType.CozyBeach:
                    CreateCozyBeach();
                    break;
                case SceneType.CityDate:
                    CreateCityDate();
                    break;
                case SceneType.FantasyGarden:
                    CreateFantasyGarden();
                    break;
                case SceneType.MountainRetreat:
                    CreateMountainRetreat();
                    break;
                case SceneType.ModernCafe:
                    CreateModernCafe();
                    break;
            }

            SetupLighting();
            SetupSkybox();
            Debug.Log($"Generated {currentSceneType} scene successfully!");
        }

        private void CreateEnvironmentBase()
        {
            // Create ground plane
            GameObject ground = GameObject.CreatePrimitive(PrimitiveType.Plane);
            ground.name = "Ground";
            ground.transform.localScale = new Vector3(sceneSize, 1, sceneSize);
            ground.transform.position = Vector3.zero;

            Material groundMat = new Material(Shader.Find("Standard"));
            groundMat.color = GetGroundColor();
            ground.GetComponent<Renderer>().material = groundMat;

            generatedObjects.Add(ground);
        }

        private Color GetGroundColor()
        {
            switch (currentSceneType)
            {
                case SceneType.RomanticPark: return new Color(0.2f, 0.6f, 0.2f); // Green grass
                case SceneType.CozyBeach: return new Color(0.9f, 0.8f, 0.6f);    // Sand
                case SceneType.CityDate: return new Color(0.3f, 0.3f, 0.3f);     // Concrete
                case SceneType.FantasyGarden: return new Color(0.3f, 0.8f, 0.3f); // Magical green
                case SceneType.MountainRetreat: return new Color(0.4f, 0.3f, 0.2f); // Rocky
                case SceneType.ModernCafe: return new Color(0.8f, 0.7f, 0.6f);   // Wood floor
                default: return Color.gray;
            }
        }

        private void CreateRomanticPark()
        {
            // Trees
            for (int i = 0; i < 15; i++)
            {
                Vector3 pos = GetRandomPosition(0.8f);
                CreateTree(pos, TreeType.Oak);
            }

            // Flowers
            for (int i = 0; i < 25; i++)
            {
                Vector3 pos = GetRandomPosition(0.9f);
                CreateFlowerPatch(pos);
            }

            // Park benches
            for (int i = 0; i < 5; i++)
            {
                Vector3 pos = GetRandomPosition(0.7f);
                CreateParkBench(pos);
            }

            // Fountain in center
            CreateFountain(Vector3.zero);

            // Walking paths
            CreatePaths();
        }

        private void CreateCozyBeach()
        {
            // Palm trees
            for (int i = 0; i < 8; i++)
            {
                Vector3 pos = GetRandomPosition(0.8f);
                CreateTree(pos, TreeType.Palm);
            }

            // Rocks
            for (int i = 0; i < 12; i++)
            {
                Vector3 pos = GetRandomPosition(0.9f);
                CreateRock(pos);
            }

            // Beach umbrellas
            for (int i = 0; i < 4; i++)
            {
                Vector3 pos = GetRandomPosition(0.6f);
                CreateBeachUmbrella(pos);
            }

            // Seashells
            for (int i = 0; i < 20; i++)
            {
                Vector3 pos = GetRandomPosition(0.95f);
                CreateSeashell(pos);
            }

            // Bonfire area
            CreateBonfire(new Vector3(0, 0, 8));
        }

        private void CreateCityDate()
        {
            // Buildings
            for (int i = 0; i < 20; i++)
            {
                Vector3 pos = GetRandomPosition(0.7f);
                CreateBuilding(pos);
            }

            // Street lamps
            for (int i = 0; i < 10; i++)
            {
                Vector3 pos = GetRandomPosition(0.8f);
                CreateStreetLamp(pos);
            }

            // Cars
            for (int i = 0; i < 8; i++)
            {
                Vector3 pos = GetRandomPosition(0.6f);
                CreateCar(pos);
            }

            // Restaurant area
            CreateRestaurant(new Vector3(5, 0, 5));
        }

        private void CreateFantasyGarden()
        {
            // Magical trees
            for (int i = 0; i < 12; i++)
            {
                Vector3 pos = GetRandomPosition(0.8f);
                CreateTree(pos, TreeType.Magical);
            }

            // Crystal formations
            for (int i = 0; i < 8; i++)
            {
                Vector3 pos = GetRandomPosition(0.7f);
                CreateCrystal(pos);
            }

            // Magical flowers
            for (int i = 0; i < 30; i++)
            {
                Vector3 pos = GetRandomPosition(0.9f);
                CreateMagicalFlower(pos);
            }

            // Fairy rings
            for (int i = 0; i < 3; i++)
            {
                Vector3 pos = GetRandomPosition(0.5f);
                CreateFairyRing(pos);
            }
        }

        private void CreateMountainRetreat()
        {
            // Pine trees
            for (int i = 0; i < 18; i++)
            {
                Vector3 pos = GetRandomPosition(0.8f);
                CreateTree(pos, TreeType.Pine);
            }

            // Large rocks
            for (int i = 0; i < 15; i++)
            {
                Vector3 pos = GetRandomPosition(0.7f);
                CreateLargeRock(pos);
            }

            // Cabin
            CreateCabin(new Vector3(8, 0, 8));

            // Campfire
            CreateCampfire(new Vector3(-5, 0, 5));
        }

        private void CreateModernCafe()
        {
            // Cafe tables
            for (int i = 0; i < 8; i++)
            {
                Vector3 pos = GetRandomPosition(0.6f);
                CreateCafeTable(pos);
            }

            // Potted plants
            for (int i = 0; i < 12; i++)
            {
                Vector3 pos = GetRandomPosition(0.8f);
                CreatePottedPlant(pos);
            }

            // Cafe counter
            CreateCafeCounter(new Vector3(0, 0, -8));

            // Outdoor heaters
            for (int i = 0; i < 4; i++)
            {
                Vector3 pos = GetRandomPosition(0.7f);
                CreateOutdoorHeater(pos);
            }
        }

        // Tree creation methods
        private enum TreeType { Oak, Palm, Pine, Magical }

        private void CreateTree(Vector3 position, TreeType treeType)
        {
            GameObject tree = new GameObject($"Tree_{treeType}");
            tree.transform.position = position;

            // Trunk
            GameObject trunk = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            trunk.name = "Trunk";
            trunk.transform.SetParent(tree.transform);
            trunk.transform.localPosition = Vector3.zero;

            Material trunkMat = new Material(Shader.Find("Standard"));
            trunkMat.color = new Color(0.4f, 0.2f, 0.1f); // Brown

            // Leaves/Crown
            GameObject crown = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            crown.name = "Crown";
            crown.transform.SetParent(tree.transform);

            Material crownMat = new Material(Shader.Find("Standard"));

            switch (treeType)
            {
                case TreeType.Oak:
                    trunk.transform.localScale = new Vector3(0.3f, 2f, 0.3f);
                    crown.transform.localPosition = new Vector3(0, 3f, 0);
                    crown.transform.localScale = new Vector3(3f, 2f, 3f);
                    crownMat.color = new Color(0.1f, 0.5f, 0.1f);
                    break;
                case TreeType.Palm:
                    trunk.transform.localScale = new Vector3(0.2f, 3f, 0.2f);
                    crown.transform.localPosition = new Vector3(0, 4f, 0);
                    crown.transform.localScale = new Vector3(2f, 0.8f, 2f);
                    crownMat.color = new Color(0.2f, 0.6f, 0.2f);
                    break;
                case TreeType.Pine:
                    trunk.transform.localScale = new Vector3(0.25f, 4f, 0.25f);
                    DestroyImmediate(crown); // Replace with cone for pine
                    crown = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                    crown.name = "Crown";
                    crown.transform.SetParent(tree.transform);
                    crown.transform.localPosition = new Vector3(0, 5f, 0);
                    crown.transform.localScale = new Vector3(1.5f, 3f, 1.5f);
                    crownMat.color = new Color(0.05f, 0.3f, 0.05f);
                    break;
                case TreeType.Magical:
                    trunk.transform.localScale = new Vector3(0.3f, 2.5f, 0.3f);
                    crown.transform.localPosition = new Vector3(0, 3.5f, 0);
                    crown.transform.localScale = new Vector3(2.5f, 2.5f, 2.5f);
                    crownMat.color = Color.HSVToRGB(Random.value, 0.7f, 1f); // Random magical colors
                    crownMat.EnableKeyword("_EMISSION");
                    crownMat.SetColor("_EmissionColor", crownMat.color * 0.3f);
                    break;
            }

            trunk.GetComponent<Renderer>().material = trunkMat;
            crown.GetComponent<Renderer>().material = crownMat;

            generatedObjects.Add(tree);
        }

        // Object creation methods
        private void CreateFlowerPatch(Vector3 position)
        {
            GameObject flowerPatch = new GameObject("FlowerPatch");
            flowerPatch.transform.position = position;

            for (int i = 0; i < Random.Range(3, 8); i++)
            {
                GameObject flower = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                flower.name = "Flower";
                flower.transform.SetParent(flowerPatch.transform);
                flower.transform.localPosition = Random.insideUnitSphere * 0.5f;
                flower.transform.localScale = Vector3.one * 0.1f;

                Material flowerMat = new Material(Shader.Find("Standard"));
                flowerMat.color = Color.HSVToRGB(Random.value, 0.8f, 1f);
                flower.GetComponent<Renderer>().material = flowerMat;

                DestroyImmediate(flower.GetComponent<Collider>());
            }

            generatedObjects.Add(flowerPatch);
        }

        private void CreateParkBench(Vector3 position)
        {
            GameObject bench = new GameObject("ParkBench");
            bench.transform.position = position;
            bench.transform.rotation = Quaternion.Euler(0, Random.Range(0, 360), 0);

            // Seat
            GameObject seat = GameObject.CreatePrimitive(PrimitiveType.Cube);
            seat.name = "Seat";
            seat.transform.SetParent(bench.transform);
            seat.transform.localPosition = new Vector3(0, 0.4f, 0);
            seat.transform.localScale = new Vector3(2f, 0.1f, 0.5f);

            // Backrest
            GameObject backrest = GameObject.CreatePrimitive(PrimitiveType.Cube);
            backrest.name = "Backrest";
            backrest.transform.SetParent(bench.transform);
            backrest.transform.localPosition = new Vector3(0, 0.8f, -0.2f);
            backrest.transform.localScale = new Vector3(2f, 0.8f, 0.1f);

            // Legs
            for (int i = 0; i < 4; i++)
            {
                GameObject leg = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                leg.name = $"Leg{i}";
                leg.transform.SetParent(bench.transform);
                float x = (i % 2 == 0) ? -0.8f : 0.8f;
                float z = (i < 2) ? 0.2f : -0.2f;
                leg.transform.localPosition = new Vector3(x, 0.2f, z);
                leg.transform.localScale = new Vector3(0.1f, 0.4f, 0.1f);
            }

            // Material
            Material woodMat = new Material(Shader.Find("Standard"));
            woodMat.color = new Color(0.4f, 0.25f, 0.1f);
            foreach (Transform child in bench.transform)
            {
                child.GetComponent<Renderer>().material = woodMat;
            }

            generatedObjects.Add(bench);
        }

        private void CreateFountain(Vector3 position)
        {
            GameObject fountain = new GameObject("Fountain");
            fountain.transform.position = position;

            // Base
            GameObject fountainBase = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            fountainBase.name = "Base";
            fountainBase.transform.SetParent(fountain.transform);
            fountainBase.transform.localPosition = Vector3.zero;
            fountainBase.transform.localScale = new Vector3(3f, 0.5f, 3f);

            // Water
            GameObject water = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            water.name = "Water";
            water.transform.SetParent(fountain.transform);
            water.transform.localPosition = new Vector3(0, 0.3f, 0);
            water.transform.localScale = new Vector3(2.8f, 0.1f, 2.8f);

            // Materials
            Material stoneMat = new Material(Shader.Find("Standard"));
            stoneMat.color = new Color(0.7f, 0.7f, 0.7f);
            fountainBase.GetComponent<Renderer>().material = stoneMat;

            Material waterMat = new Material(Shader.Find("Standard"));
            waterMat.color = new Color(0.2f, 0.6f, 1f, 0.7f);
            waterMat.SetFloat("_Metallic", 0.8f);
            waterMat.SetFloat("_Glossiness", 0.9f);
            water.GetComponent<Renderer>().material = waterMat;

            generatedObjects.Add(fountain);
        }

        private void CreateBuilding(Vector3 position)
        {
            GameObject building = new GameObject("Building");
            building.transform.position = position;

            float height = Random.Range(3f, 15f);
            float width = Random.Range(2f, 5f);
            float depth = Random.Range(2f, 5f);

            GameObject structure = GameObject.CreatePrimitive(PrimitiveType.Cube);
            structure.name = "Structure";
            structure.transform.SetParent(building.transform);
            structure.transform.localPosition = new Vector3(0, height / 2, 0);
            structure.transform.localScale = new Vector3(width, height, depth);

            Material buildingMat = new Material(Shader.Find("Standard"));
            buildingMat.color = new Color(Random.Range(0.3f, 0.8f), Random.Range(0.3f, 0.8f), Random.Range(0.3f, 0.8f));
            structure.GetComponent<Renderer>().material = buildingMat;

            generatedObjects.Add(building);
        }

        private void CreateCafeTable(Vector3 position)
        {
            GameObject table = new GameObject("CafeTable");
            table.transform.position = position;

            // Table top
            GameObject top = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            top.name = "TableTop";
            top.transform.SetParent(table.transform);
            top.transform.localPosition = new Vector3(0, 0.7f, 0);
            top.transform.localScale = new Vector3(1f, 0.05f, 1f);

            // Table leg
            GameObject leg = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            leg.name = "TableLeg";
            leg.transform.SetParent(table.transform);
            leg.transform.localPosition = new Vector3(0, 0.35f, 0);
            leg.transform.localScale = new Vector3(0.1f, 0.7f, 0.1f);

            // Chairs
            for (int i = 0; i < 2; i++)
            {
                GameObject chair = CreateChair();
                chair.transform.SetParent(table.transform);
                float angle = i * 180f;
                chair.transform.localPosition = new Vector3(Mathf.Sin(angle * Mathf.Deg2Rad) * 1.2f, 0, Mathf.Cos(angle * Mathf.Deg2Rad) * 1.2f);
                chair.transform.localRotation = Quaternion.Euler(0, angle, 0);
            }

            Material tableMat = new Material(Shader.Find("Standard"));
            tableMat.color = new Color(0.6f, 0.4f, 0.2f);
            top.GetComponent<Renderer>().material = tableMat;
            leg.GetComponent<Renderer>().material = tableMat;

            generatedObjects.Add(table);
        }

        private GameObject CreateChair()
        {
            GameObject chair = new GameObject("Chair");

            // Seat
            GameObject seat = GameObject.CreatePrimitive(PrimitiveType.Cube);
            seat.name = "Seat";
            seat.transform.SetParent(chair.transform);
            seat.transform.localPosition = new Vector3(0, 0.4f, 0);
            seat.transform.localScale = new Vector3(0.5f, 0.05f, 0.5f);

            // Backrest
            GameObject backrest = GameObject.CreatePrimitive(PrimitiveType.Cube);
            backrest.name = "Backrest";
            backrest.transform.SetParent(chair.transform);
            backrest.transform.localPosition = new Vector3(0, 0.7f, -0.2f);
            backrest.transform.localScale = new Vector3(0.5f, 0.6f, 0.05f);

            // Legs
            for (int i = 0; i < 4; i++)
            {
                GameObject leg = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                leg.name = $"Leg{i}";
                leg.transform.SetParent(chair.transform);
                float x = (i % 2 == 0) ? -0.2f : 0.2f;
                float z = (i < 2) ? 0.2f : -0.2f;
                leg.transform.localPosition = new Vector3(x, 0.2f, z);
                leg.transform.localScale = new Vector3(0.05f, 0.4f, 0.05f);
            }

            Material chairMat = new Material(Shader.Find("Standard"));
            chairMat.color = new Color(0.3f, 0.2f, 0.1f);
            foreach (Transform child in chair.transform)
            {
                child.GetComponent<Renderer>().material = chairMat;
            }

            return chair;
        }

        private void CreateRock(Vector3 position)
        {
            GameObject rock = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            rock.name = "Rock";
            rock.transform.position = position;
            rock.transform.localScale = new Vector3(Random.Range(0.5f, 2f), Random.Range(0.3f, 1f), Random.Range(0.5f, 2f));
            rock.transform.rotation = Quaternion.Euler(0, Random.Range(0, 360), 0);

            Material rockMat = new Material(Shader.Find("Standard"));
            rockMat.color = new Color(0.4f, 0.4f, 0.4f);
            rock.GetComponent<Renderer>().material = rockMat;

            generatedObjects.Add(rock);
        }

        private void CreateCrystal(Vector3 position)
        {
            GameObject crystal = new GameObject("Crystal");
            crystal.transform.position = position;

            GameObject shard = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            shard.name = "Shard";
            shard.transform.SetParent(crystal.transform);
            shard.transform.localPosition = Vector3.zero;
            shard.transform.localScale = new Vector3(0.5f, 2f, 0.5f);

            Material crystalMat = new Material(Shader.Find("Standard"));
            crystalMat.color = Color.HSVToRGB(Random.value, 0.8f, 1f);
            crystalMat.SetFloat("_Metallic", 0.2f);
            crystalMat.SetFloat("_Glossiness", 0.9f);
            crystalMat.EnableKeyword("_EMISSION");
            crystalMat.SetColor("_EmissionColor", crystalMat.color * 0.5f);
            shard.GetComponent<Renderer>().material = crystalMat;

            generatedObjects.Add(crystal);
        }

        private void CreateMagicalFlower(Vector3 position)
        {
            GameObject flower = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            flower.name = "MagicalFlower";
            flower.transform.position = position;
            flower.transform.localScale = Vector3.one * 0.2f;

            Material magicalMat = new Material(Shader.Find("Standard"));
            magicalMat.color = Color.HSVToRGB(Random.value, 1f, 1f);
            magicalMat.EnableKeyword("_EMISSION");
            magicalMat.SetColor("_EmissionColor", magicalMat.color * 0.8f);
            flower.GetComponent<Renderer>().material = magicalMat;

            DestroyImmediate(flower.GetComponent<Collider>());
            generatedObjects.Add(flower);
        }

        private void CreateFairyRing(Vector3 position)
        {
            GameObject fairyRing = new GameObject("FairyRing");
            fairyRing.transform.position = position;

            int mushroomCount = 12;
            float radius = 3f;

            for (int i = 0; i < mushroomCount; i++)
            {
                float angle = (i / (float)mushroomCount) * 360f * Mathf.Deg2Rad;
                Vector3 mushroomPos = new Vector3(Mathf.Cos(angle) * radius, 0, Mathf.Sin(angle) * radius);

                GameObject mushroom = GameObject.CreatePrimitive(PrimitiveType.Capsule);
                mushroom.name = "Mushroom";
                mushroom.transform.SetParent(fairyRing.transform);
                mushroom.transform.localPosition = mushroomPos;
                mushroom.transform.localScale = new Vector3(0.2f, 0.3f, 0.2f);

                Material mushroomMat = new Material(Shader.Find("Standard"));
                mushroomMat.color = new Color(Random.Range(0.6f, 1f), Random.Range(0.2f, 0.4f), Random.Range(0.2f, 0.4f));
                mushroom.GetComponent<Renderer>().material = mushroomMat;
            }

            generatedObjects.Add(fairyRing);
        }

        private void CreatePaths()
        {
            // Create simple walking paths
            for (int i = 0; i < 3; i++)
            {
                GameObject path = GameObject.CreatePrimitive(PrimitiveType.Cube);
                path.name = "Path";
                path.transform.position = new Vector3(Random.Range(-20f, 20f), -0.05f, Random.Range(-20f, 20f));
                path.transform.localScale = new Vector3(2f, 0.1f, 10f);
                path.transform.rotation = Quaternion.Euler(0, Random.Range(0, 180), 0);

                Material pathMat = new Material(Shader.Find("Standard"));
                pathMat.color = new Color(0.6f, 0.5f, 0.4f);
                path.GetComponent<Renderer>().material = pathMat;

                generatedObjects.Add(path);
            }
        }

        private void SetupLighting()
        {
            // Create directional light if none exists
            Light directionalLight = FindObjectOfType<Light>();
            if (directionalLight == null)
            {
                GameObject lightGO = new GameObject("Directional Light");
                directionalLight = lightGO.AddComponent<Light>();
                directionalLight.type = LightType.Directional;
            }

            switch (currentSceneType)
            {
                case SceneType.RomanticPark:
                    directionalLight.color = new Color(1f, 0.95f, 0.8f);
                    directionalLight.intensity = 1.2f;
                    break;
                case SceneType.CozyBeach:
                    directionalLight.color = new Color(1f, 0.9f, 0.7f);
                    directionalLight.intensity = 1.5f;
                    break;
                case SceneType.CityDate:
                    directionalLight.color = new Color(0.9f, 0.9f, 1f);
                    directionalLight.intensity = 0.8f;
                    break;
                case SceneType.FantasyGarden:
                    directionalLight.color = new Color(0.8f, 1f, 0.9f);
                    directionalLight.intensity = 1.1f;
                    break;
                case SceneType.MountainRetreat:
                    directionalLight.color = new Color(1f, 1f, 0.9f);
                    directionalLight.intensity = 1.3f;
                    break;
                case SceneType.ModernCafe:
                    directionalLight.color = new Color(1f, 0.95f, 0.85f);
                    directionalLight.intensity = 1.0f;
                    break;
            }

            directionalLight.transform.rotation = Quaternion.Euler(45f, -30f, 0f);
        }

        private void SetupSkybox()
        {
            Material skyboxMat = new Material(Shader.Find("Skybox/Gradient"));

            switch (currentSceneType)
            {
                case SceneType.RomanticPark:
                    skyboxMat.SetColor("_Color1", new Color(0.5f, 0.8f, 1f)); // Light blue
                    skyboxMat.SetColor("_Color2", new Color(1f, 0.8f, 0.6f)); // Warm sunset
                    break;
                case SceneType.CozyBeach:
                    skyboxMat.SetColor("_Color1", new Color(0.4f, 0.7f, 1f)); // Ocean blue
                    skyboxMat.SetColor("_Color2", new Color(1f, 0.7f, 0.4f)); // Beach sunset
                    break;
                case SceneType.CityDate:
                    skyboxMat.SetColor("_Color1", new Color(0.2f, 0.2f, 0.4f)); // Night blue
                    skyboxMat.SetColor("_Color2", new Color(0.8f, 0.6f, 0.2f)); // City lights
                    break;
                case SceneType.FantasyGarden:
                    skyboxMat.SetColor("_Color1", new Color(0.6f, 0.4f, 0.8f)); // Magical purple
                    skyboxMat.SetColor("_Color2", new Color(0.8f, 0.6f, 1f));   // Mystical pink
                    break;
                case SceneType.MountainRetreat:
                    skyboxMat.SetColor("_Color1", new Color(0.3f, 0.5f, 0.8f)); // Mountain blue
                    skyboxMat.SetColor("_Color2", new Color(0.9f, 0.9f, 0.8f)); // Crisp white
                    break;
                case SceneType.ModernCafe:
                    skyboxMat.SetColor("_Color1", new Color(0.6f, 0.7f, 0.8f)); // Soft gray
                    skyboxMat.SetColor("_Color2", new Color(1f, 0.9f, 0.8f));   // Warm cream
                    break;
            }

            RenderSettings.skybox = skyboxMat;
        }

        private Vector3 GetRandomPosition(float boundary = 1f)
        {
            float range = sceneSize * 0.4f * boundary;
            return new Vector3(
                Random.Range(-range, range),
                0,
                Random.Range(-range, range)
            );
        }

        [ContextMenu("Clear Current Scene")]
        public void ClearCurrentScene()
        {
            foreach (GameObject obj in generatedObjects)
            {
                if (obj != null)
                {
                    DestroyImmediate(obj);
                }
            }
            generatedObjects.Clear();
            Debug.Log("Cleared current scene");
        }

        [ContextMenu("Randomize Scene Type")]
        public void RandomizeSceneType()
        {
            System.Array sceneTypes = System.Enum.GetValues(typeof(SceneType));
            currentSceneType = (SceneType)sceneTypes.GetValue(Random.Range(0, sceneTypes.Length));
            Debug.Log($"Scene type changed to: {currentSceneType}");
        }

        // Additional helper methods for more complex objects
        private void CreateBeachUmbrella(Vector3 position) { /* Implementation */ }
        private void CreateSeashell(Vector3 position) { /* Implementation */ }
        private void CreateBonfire(Vector3 position) { /* Implementation */ }
        private void CreateStreetLamp(Vector3 position) { /* Implementation */ }
        private void CreateCar(Vector3 position) { /* Implementation */ }
        private void CreateRestaurant(Vector3 position) { /* Implementation */ }
        private void CreateLargeRock(Vector3 position) { /* Implementation */ }
        private void CreateCabin(Vector3 position) { /* Implementation */ }
        private void CreateCampfire(Vector3 position) { /* Implementation */ }
        private void CreatePottedPlant(Vector3 position) { /* Implementation */ }
        private void CreateCafeCounter(Vector3 position) { /* Implementation */ }
        private void CreateOutdoorHeater(Vector3 position) { /* Implementation */ }
    }
}