using UnityEngine;

namespace HeartQuest
{
    public class VehicleController : MonoBehaviour
    {
        public float acceleration = 8f;
        public float maxSpeed = 20f;
        public float turnSpeed = 60f;
        public float brakeDrag = 5f;

        private Rigidbody _rb;

        void Awake()
        {
            _rb = GetComponent<Rigidbody>();
            if (_rb != null)
            {
                _rb.centerOfMass = new Vector3(0, -0.5f, 0);
            }
        }

        void FixedUpdate()
        {
            float v = Input.GetAxis("Vertical");
            float h = Input.GetAxis("Horizontal");

            if (_rb == null) return;

            // Forward/backward force
            Vector3 force = transform.forward * (v * acceleration);
            _rb.AddForce(force, ForceMode.Acceleration);

            // Clamp speed
            Vector3 flatVel = new Vector3(_rb.velocity.x, 0f, _rb.velocity.z);
            if (flatVel.magnitude > maxSpeed)
            {
                flatVel = flatVel.normalized * maxSpeed;
                _rb.velocity = new Vector3(flatVel.x, _rb.velocity.y, flatVel.z);
            }

            // Turning
            if (flatVel.magnitude > 0.1f)
            {
                float turn = h * turnSpeed * Time.fixedDeltaTime;
                _rb.MoveRotation(_rb.rotation * Quaternion.Euler(0f, turn, 0f));
            }

            // Brake with Space
            if (Input.GetKey(KeyCode.Space))
            {
                _rb.drag = brakeDrag;
            }
            else
            {
                _rb.drag = 0f;
            }
        }
    }
}


