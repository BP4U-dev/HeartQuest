using UnityEngine;

namespace HeartQuest
{
    public class AvatarController : MonoBehaviour
    {
        [Header("Movement Settings")]
        public float moveSpeed = 5f;
        public float rotationSpeed = 180f;
        public float jumpForce = 5f;

        [Header("Appearance Settings")]
        public Color skinColor = new Color(0.956f, 0.761f, 0.631f);
        public Color hairColor = new Color(0.545f, 0.271f, 0.075f);
        public string hairStyle = "short";

        private Rigidbody _rb;

        void Awake()
        {
            _rb = GetComponent<Rigidbody>();
            ApplyAppearance();
        }

        void Update()
        {
            HandleMovement();
        }

        private void HandleMovement()
        {
            float h = Input.GetAxis("Horizontal");
            float v = Input.GetAxis("Vertical");

            // Rotate avatar
            transform.Rotate(0f, h * rotationSpeed * Time.deltaTime, 0f);

            // Move forward/backward
            Vector3 forward = transform.forward * (v * moveSpeed * Time.deltaTime);
            transform.position += forward;

            // Jump
            if (Input.GetKeyDown(KeyCode.Space) && _rb != null)
            {
                _rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
            }
        }

        public void ApplyAppearance()
        {
            // Tries to find child renderers named "Head", "Hair" to tint materials
            var head = transform.Find("Head");
            if (head != null)
            {
                var mr = head.GetComponent<Renderer>();
                if (mr != null && mr.material != null)
                {
                    mr.material.color = skinColor;
                }
            }

            var hair = transform.Find("Hair");
            if (hair != null)
            {
                var mr = hair.GetComponent<Renderer>();
                if (mr != null && mr.material != null)
                {
                    mr.material.color = hairColor;
                }
            }
        }
    }
}


