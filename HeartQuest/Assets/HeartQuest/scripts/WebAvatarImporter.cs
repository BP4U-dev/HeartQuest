using UnityEngine;

public class WebAvatarImporter : MonoBehaviour
{
    [Header("Avatar Settings")]
    public float avatarHeight = 1.7f;
    public Color skinColor = Color.white;
    public Color hairColor = Color.brown;
    
    private GameObject headPart;
    
    void Start()
    {
        CreateSimpleAvatar();
    }
    
    void CreateSimpleAvatar()
    {
        headPart = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        headPart.name = "Head";
        headPart.transform.SetParent(transform);
        headPart.transform.localPosition = new Vector3(0, 1.5f, 0);
        headPart.transform.localScale = new Vector3(0.5f, 0.5f, 0.5f);
        
        Destroy(headPart.GetComponent<Collider>());
        
        GetComponent<Renderer>().material.color = skinColor;
        headPart.GetComponent<Renderer>().material.color = skinColor;
        
        Debug.Log("Simple avatar created!");
    }
    
    [ContextMenu("Change Colors")]
    public void ChangeColors()
    {
        skinColor = new Color(Random.Range(0.7f, 1f), Random.Range(0.5f, 0.9f), Random.Range(0.4f, 0.8f));
        hairColor = new Color(Random.Range(0.2f, 0.8f), Random.Range(0.1f, 0.5f), Random.Range(0.0f, 0.3f));
        
        GetComponent<Renderer>().material.color = skinColor;
        if (headPart != null)
        {
            headPart.GetComponent<Renderer>().material.color = skinColor;
        }
        
        Debug.Log("Colors changed!");
    }
    
    [ContextMenu("Change Size")]
    public void ChangeSize()
    {
        avatarHeight = Random.Range(1.2f, 2.2f);
        transform.localScale = Vector3.one * (avatarHeight / 1.7f);
        Debug.Log("Size changed to: " + avatarHeight);
    }
}