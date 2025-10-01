using System;
using System.Collections.Generic;
using System.Diagnostics;
using UnityEngine;

namespace HeartQuest

    {
{
    public class RealisticAvatarGenerator : MonoBehaviour
    {
        [Header("Avatar Prefab Parts")]
        public GameObject avatarBasePrefab;
        public Material[] skinMaterials;
        public Material[] hairMaterials;
        public Material[] clothingMaterials;
        public GameObject[] hairStyles;
        public GameObject[] accessories;

        [Header("Generated Avatars")]
        public List<GameObject> generatedAvatars = new List<GameObject>();

        [Header("Avatar Customization")]
        [Range(0.8f, 1.3f)]
        public float heightVariation = 1.0f;
        [Range(0.7f, 1.4f)]
        public float bodyWidthVariation = 1.0f;

        void Start()
        {
            if (avatarBasePrefab == null)
            {
                CreateBasicAvatarPrefab();
            }
        }

        [ContextMenu("Generate Realistic Avatar")]
        public void GenerateRealisticAvatar()
        {
            GameObject newAvatar = CreateDetailedAvatar();
            if (newAvatar != null)
            {
                generatedAvatars.Add(newAvatar);
                Debug.Log($"Created realistic avatar: {newAvatar.name}");
            }
        }

        [ContextMenu("Generate 5 Random Avatars")]
        public void GenerateMultipleAvatars()
        {
            for (int i = 0; i < 5; i++)
            {
                Vector3 spawnPos = new Vector3(i * 3f, 0, 0);
                GameObject avatar = CreateDetailedAvatar(spawnPos);
                if (avatar != null)
                {
                    generatedAvatars.Add(avatar);
                }
            }
            Debug.Log("Generated 5 realistic avatars!");
        }

        private GameObject CreateDetailedAvatar(Vector3 position = default)
        {
            GameObject avatar = new GameObject("RealisticAvatar_" + Random.Range(1000, 9999));
            avatar.transform.position = position;

            // Create body parts
            CreateBodyPart(avatar, "Head", PrimitiveType.Sphere, new Vector3(0, 1.7f, 0), new Vector3(0.35f, 0.4f, 0.35f));
            CreateBodyPart(avatar, "Neck", PrimitiveType.Cylinder, new Vector3(0, 1.45f, 0), new Vector3(0.1f, 0.1f, 0.1f));
            CreateBodyPart(avatar, "Torso", PrimitiveType.Capsule, new Vector3(0, 1.0f, 0), new Vector3(0.4f, 0.6f, 0.25f));
            CreateBodyPart(avatar, "Hips", PrimitiveType.Sphere, new Vector3(0, 0.7f, 0), new Vector3(0.35f, 0.2f, 0.3f));

            // Arms
            CreateLimb(avatar, "LeftArm", new Vector3(-0.6f, 1.2f, 0), new Vector3(0.1f, 0.4f, 0.1f));
            CreateLimb(avatar, "RightArm", new Vector3(0.6f, 1.2f, 0), new Vector3(0.1f, 0.4f, 0.1f));
            CreateLimb(avatar, "LeftForearm", new Vector3(-0.6f, 0.7f, 0), new Vector3(0.08f, 0.3f, 0.08f));
            CreateLimb(avatar, "RightForearm", new Vector3(0.6f, 0.7f, 0), new Vector3(0.08f, 0.3f, 0.08f));

            // Legs
            CreateLimb(avatar, "LeftThigh", new Vector3(-0.2f, 0.3f, 0), new Vector3(0.12f, 0.4f, 0.12f));
            CreateLimb(avatar, "RightThigh", new Vector3(0.2f, 0.3f, 0), new Vector3(0.12f, 0.4f, 0.12f));
            CreateLimb(avatar, "LeftShin", new Vector3(-0.2f, -0.2f, 0), new Vector3(0.1f, 0.35f, 0.1f));
            CreateLimb(avatar, "RightShin", new Vector3(0.2f, -0.2f, 0), new Vector3(0.1f, 0.35f, 0.1f));

            // Hands and feet
            CreateBodyPart(avatar, "LeftHand", PrimitiveType.Sphere, new Vector3(-0.6f, 0.4f, 0), new Vector3(0.08f, 0.12f, 0.06f));
            CreateBodyPart(avatar, "RightHand", PrimitiveType.Sphere, new Vector3(0.6f, 0.4f, 0), new Vector3(0.08f, 0.12f, 0.06f));
            CreateBodyPart(avatar, "LeftFoot", PrimitiveType.Cube, new Vector3(-0.2f, -0.55f, 0.1f), new Vector3(0.12f, 0.05f, 0.25f));
            CreateBodyPart(avatar, "RightFoot", PrimitiveType.Cube, new Vector3(0.2f, -0.55f, 0.1f), new Vector3(0.12f, 0.05f, 0.25f));

            // Apply realistic materials
            ApplyRealisticMaterials(avatar);

            // Add hair
            AddHairToAvatar(avatar);

            // Add facial features
            AddFacialFeatures(avatar);

            // Add clothing
            AddClothingToAvatar(avatar);

            // Add game components
            SetupAvatarForGame(avatar);

            // Apply random variations
            ApplyBodyVariations(avatar);

            return avatar;
        }

        private void CreateBodyPart(GameObject parent, string name, PrimitiveType type, Vector3 position, Vector3 scale)
        {
            GameObject part = GameObject.CreatePrimitive(type);
            part.name = name;
            part.transform.SetParent(parent.transform);
            part.transform.localPosition = position;
            part.transform.localScale = scale;

            // Remove colliders from body parts (we'll add one main collider)
            if (name != "Head") // Keep head collider for headshots
            {
                Collider col = part.GetComponent<Collider>();
                if (col != null) DestroyImmediate(col);
            }
        }

        private void CreateLimb(GameObject parent, string name, Vector3 position, Vector3 scale)
        {
            GameObject limb = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            limb.name = name;
            limb.transform.SetParent(parent.transform);
            limb.transform.localPosition = position;
            limb.transform.localScale = scale;

            // Remove collider
            Collider col = limb.GetComponent<Collider>();
            if (col != null) DestroyImmediate(col);
        }

        private void ApplyRealisticMaterials(GameObject avatar)
        {
            // Skin material
            Material skinMat = CreateSkinMaterial();

            // Apply to all body parts
            string[] bodyParts = {"Head", "Neck", "LeftArm", "RightArm", "LeftForearm", "RightForearm",
                                 "LeftHand", "RightHand", "LeftThigh", "RightThigh", "LeftShin", "RightShin"};

            foreach (string partName in bodyParts)
            {
                Transform part = avatar.transform.Find(partName);
                if (part != null)
                {
                    Renderer renderer = part.GetComponent<Renderer>();
                    if (renderer != null)
                    {
                        renderer.material = skinMat;
                    }
                }
            }
        }

        private Material CreateSkinMaterial()
        {
            Material skinMat = new Material(Shader.Find("Standard"));

            // Realistic skin colors
            Color[] skinTones = {
                new Color(0.96f, 0.89f, 0.74f), // Light
                new Color(0.87f, 0.72f, 0.53f), // Medium
                new Color(0.68f, 0.57f, 0.42f), // Tan
                new Color(0.55f, 0.42f, 0.31f), // Dark
                new Color(0.36f, 0.28f, 0.20f)  // Very Dark
            };

            skinMat.color = skinTones[Random.Range(0, skinTones.Length)];
            skinMat.SetFloat("_Glossiness", 0.3f); // Slight shine for realism
            skinMat.SetFloat("_Metallic", 0.0f);   // Non-metallic

            return skinMat;
        }

        private void AddHairToAvatar(GameObject avatar)
        {
            Transform head = avatar.transform.Find("Head");
            if (head == null) return;

            GameObject hair = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            hair.name = "Hair";
            hair.transform.SetParent(head);
            hair.transform.localPosition = new Vector3(0, 0.2f, 0);

            // Random hair styles
            int hairStyle = Random.Range(0, 5);
            switch (hairStyle)
            {
                case 0: // Short
                    hair.transform.localScale = new Vector3(1.1f, 0.6f, 1.1f);
                    break;
                case 1: // Medium
                    hair.transform.localScale = new Vector3(1.2f, 0.8f, 1.2f);
                    break;
                case 2: // Long
                    hair.transform.localScale = new Vector3(1.1f, 1.4f, 1.1f);
                    break;
                case 3: // Curly
                    hair.transform.localScale = new Vector3(1.4f, 1.0f, 1.4f);
                    break;
                case 4: // Bald
                    hair.SetActive(false);
                    return;
            }

            // Hair colors
            Material hairMat = new Material(Shader.Find("Standard"));
            Color[] hairColors = {
                new Color(0.1f, 0.05f, 0.02f),  // Black
                new Color(0.35f, 0.2f, 0.1f),   // Dark Brown
                new Color(0.55f, 0.4f, 0.25f),  // Brown
                new Color(0.8f, 0.65f, 0.4f),   // Light Brown
                new Color(0.9f, 0.8f, 0.6f),    // Blonde
                new Color(0.7f, 0.1f, 0.1f)     // Red
            };

            hairMat.color = hairColors[Random.Range(0, hairColors.Length)];
            hair.GetComponent<Renderer>().material = hairMat;

            // Remove collider
            DestroyImmediate(hair.GetComponent<Collider>());
        }

        private void AddFacialFeatures(GameObject avatar)
        {
            Transform head = avatar.transform.Find("Head");
            if (head == null) return;

            // Eyes
            CreateEye(head, "LeftEye", new Vector3(-0.12f, 0.1f, 0.25f));
            CreateEye(head, "RightEye", new Vector3(0.12f, 0.1f, 0.25f));

            // Nose
            GameObject nose = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            nose.name = "Nose";
            nose.transform.SetParent(head);
            nose.transform.localPosition = new Vector3(0, 0, 0.3f);
            nose.transform.localScale = new Vector3(0.15f, 0.1f, 0.2f);
            nose.GetComponent<Renderer>().material = head.GetComponent<Renderer>().material;
            DestroyImmediate(nose.GetComponent<Collider>());

            // Mouth
            GameObject mouth = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            mouth.name = "Mouth";
            mouth.transform.SetParent(head);
            mouth.transform.localPosition = new Vector3(0, -0.15f, 0.25f);
            mouth.transform.localScale = new Vector3(0.2f, 0.05f, 0.1f);

            Material mouthMat = new Material(Shader.Find("Standard"));
            mouthMat.color = new Color(0.8f, 0.4f, 0.4f); // Pinkish
            mouth.GetComponent<Renderer>().material = mouthMat;
            DestroyImmediate(mouth.GetComponent<Collider>());
        }

        private void CreateEye(Transform head, string name, Vector3 position)
        {
            GameObject eye = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            eye.name = name;
            eye.transform.SetParent(head);
            eye.transform.localPosition = position;
            eye.transform.localScale = new Vector3(0.1f, 0.1f, 0.08f);

            Material eyeMat = new Material(Shader.Find("Standard"));
            Color[] eyeColors = {
                new Color(0.4f, 0.2f, 0.1f),   // Brown
                new Color(0.2f, 0.4f, 0.8f),   // Blue
                new Color(0.2f, 0.6f, 0.2f),   // Green
                new Color(0.5f, 0.5f, 0.5f),   // Gray
                new Color(0.1f, 0.1f, 0.1f)    // Black
            };

            eyeMat.color = eyeColors[Random.Range(0, eyeColors.Length)];
            eye.GetComponent<Renderer>().material = eyeMat;
            DestroyImmediate(eye.GetComponent<Collider>());
        }

        private void AddClothingToAvatar(GameObject avatar)
        {
            // Shirt
            Transform torso = avatar.transform.Find("Torso");
            if (torso != null)
            {
                Material clothingMat = new Material(Shader.Find("Standard"));
                Color[] clothingColors = {
                    Color.blue, Color.red, Color.green, Color.yellow,
                    Color.purple, Color.cyan, Color.white, Color.black
                };
                clothingMat.color = clothingColors[Random.Range(0, clothingColors.Length)];
                torso.GetComponent<Renderer>().material = clothingMat;
            }

            // Pants
            Transform hips = avatar.transform.Find("Hips");
            Transform leftThigh = avatar.transform.Find("LeftThigh");
            Transform rightThigh = avatar.transform.Find("RightThigh");
            Transform leftShin = avatar.transform.Find("LeftShin");
            Transform rightShin = avatar.transform.Find("RightShin");

            Material pantsMat = new Material(Shader.Find("Standard"));
            Color[] pantsColors = { Color.blue, Color.black, Color.gray, new Color(0.4f, 0.2f, 0.1f) };
            pantsMat.color = pantsColors[Random.Range(0, pantsColors.Length)];

            if (hips != null) hips.GetComponent<Renderer>().material = pantsMat;
            if (leftThigh != null) leftThigh.GetComponent<Renderer>().material = pantsMat;
            if (rightThigh != null) rightThigh.GetComponent<Renderer>().material = pantsMat;
            if (leftShin != null) leftShin.GetComponent<Renderer>().material = pantsMat;
            if (rightShin != null) rightShin.GetComponent<Renderer>().material = pantsMat;
        }

        private void SetupAvatarForGame(GameObject avatar)
        {
            // Add main collider
            CapsuleCollider mainCollider = avatar.AddComponent<CapsuleCollider>();
            mainCollider.height = 2.0f;
            mainCollider.radius = 0.5f;
            mainCollider.center = new Vector3(0, 1.0f, 0);

            // Add physics
            Rigidbody rb = avatar.AddComponent<Rigidbody>();
            rb.constraints = RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationZ;

            // Add avatar controller
            avatar.AddComponent<AvatarController>();

            // Add realistic avatar behavior
            avatar.AddComponent<RealisticAvatarBehavior>();
        }

        private void ApplyBodyVariations(GameObject avatar)
        {
            // Apply height variation
            avatar.transform.localScale = Vector3.one * heightVariation;

            // Apply body width variation to torso
            Transform torso = avatar.transform.Find("Torso");
            if (torso != null)
            {
                Vector3 torsoScale = torso.localScale;
                torsoScale.x *= bodyWidthVariation;
                torsoScale.z *= bodyWidthVariation;
                torso.localScale = torsoScale;
            }
        }

        private void CreateBasicAvatarPrefab()
        {
            Debug.Log("Creating basic avatar prefab structure...");
            // This method ensures we have a basic avatar system even without external assets
        }

        [ContextMenu("Clear All Generated Avatars")]
        public void ClearAllAvatars()
        {
            foreach (GameObject avatar in generatedAvatars)
            {
                if (avatar != null)
                {
                    DestroyImmediate(avatar);
                }
            }
            generatedAvatars.Clear();
            Debug.Log("Cleared all generated avatars");
        }
    }

    // Realistic avatar behavior component
    public class RealisticAvatarBehavior : MonoBehaviour
    {
        [Header("Behavior Settings")]
        public float walkSpeed = 2f;
        public float idleTime = 3f;
        public float walkTime = 5f;

        private bool isWalking = false;
        private Vector3 targetPosition;
        private float behaviorTimer = 0f;

        void Start()
        {
            ChooseRandomBehavior();
        }

        void Update()
        {
            behaviorTimer += Time.deltaTime;

            if (isWalking)
            {
                WalkToTarget();
                if (behaviorTimer >= walkTime || ReachedTarget())
                {
                    StartIdling();
                }
            }
            else
            {
                if (behaviorTimer >= idleTime)
                {
                    StartWalking();
                }
            }
        }

        void ChooseRandomBehavior()
        {
            if (Random.value > 0.5f)
                StartWalking();
            else
                StartIdling();
        }

        void StartWalking()
        {
            isWalking = true;
            behaviorTimer = 0f;

            // Choose random target within reasonable distance
            Vector3 randomDirection = Random.insideUnitSphere * 10f;
            randomDirection.y = 0; // Keep on ground level
            targetPosition = transform.position + randomDirection;
        }

        void StartIdling()
        {
            isWalking = false;
            behaviorTimer = 0f;
        }

        void WalkToTarget()
        {
            Vector3 direction = (targetPosition - transform.position).normalized;
            transform.position += direction * walkSpeed * Time.deltaTime;

            // Face movement direction
            if (direction != Vector3.zero)
            {
                transform.rotation = Quaternion.LookRotation(direction);
            }
        }

        bool ReachedTarget()
        {
            return Vector3.Distance(transform.position, targetPosition) < 1f;
        }
    }
}
