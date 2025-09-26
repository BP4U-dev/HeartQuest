// HeartQuest Avatar Customization Functions

/**
 * Updates the skin color of the avatar
 * This function is called when the color picker value changes
 */
function updateSkinColor() {
    const skinColorPicker = document.getElementById('skinColor');
    const selectedColor = skinColorPicker.value;
    
    // Log the selected color for debugging
    console.log('Skin color updated to:', selectedColor);
    
    // Update avatar skin color (this would integrate with your 3D avatar system)
    updateAvatarSkinColor(selectedColor);
    
    // Optional: Show visual feedback
    showColorUpdateFeedback(selectedColor);
}

/**
 * Updates the avatar's skin color in the 3D system
 * @param {string} color - The hex color value
 */
function updateAvatarSkinColor(color) {
    // This function would integrate with your 3D avatar system
    // For now, we'll store the color in localStorage for persistence
    localStorage.setItem('avatarSkinColor', color);
    
    // If you have a 3D avatar system, you would call the appropriate API here
    // Example: avatarSystem.setSkinColor(color);
    
    console.log('Avatar skin color set to:', color);
}

/**
 * Updates the hair color of the avatar
 * This function is called when the hair color picker value changes
 */
function updateHairColor() {
    const hairColorPicker = document.getElementById('hairColor');
    const selectedColor = hairColorPicker.value;
    
    // Log the selected color for debugging
    console.log('Hair color updated to:', selectedColor);
    
    // Update avatar hair color (this would integrate with your 3D avatar system)
    updateAvatarHairColor(selectedColor);
    
    // Optional: Show visual feedback
    showColorUpdateFeedback(selectedColor, 'Hair Color');
}

/**
 * Updates the avatar's hair color in the 3D system
 * @param {string} color - The hex color value
 */
function updateAvatarHairColor(color) {
    // This function would integrate with your 3D avatar system
    // For now, we'll store the color in localStorage for persistence
    localStorage.setItem('avatarHairColor', color);
    
    // If you have a 3D avatar system, you would call the appropriate API here
    // Example: avatarSystem.setHairColor(color);
    
    console.log('Avatar hair color set to:', color);
}

/**
 * Shows visual feedback when color is updated
 * @param {string} color - The hex color value
 * @param {string} type - The type of color being updated
 */
function showColorUpdateFeedback(color, type = 'Skin Color') {
    // Create a temporary visual indicator
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transition: opacity 0.3s ease;
    `;
    feedback.textContent = `${type}: ${color}`;
    
    document.body.appendChild(feedback);
    
    // Remove the feedback after 2 seconds
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}

/**
 * Loads saved avatar colors on page load
 */
function loadSavedAvatarColors() {
    // Load saved skin color
    const savedSkinColor = localStorage.getItem('avatarSkinColor');
    if (savedSkinColor) {
        const skinColorPicker = document.getElementById('skinColor');
        if (skinColorPicker) {
            skinColorPicker.value = savedSkinColor;
            console.log('Loaded saved skin color:', savedSkinColor);
        }
    }
    
    // Load saved hair color
    const savedHairColor = localStorage.getItem('avatarHairColor');
    if (savedHairColor) {
        const hairColorPicker = document.getElementById('hairColor');
        if (hairColorPicker) {
            hairColorPicker.value = savedHairColor;
            console.log('Loaded saved hair color:', savedHairColor);
        }
    }
}

// Initialize the avatar customization when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadSavedAvatarColors();
    
    // Add event listeners for skin color picker
    const skinColorPicker = document.getElementById('skinColor');
    if (skinColorPicker) {
        // Add input event for real-time updates
        skinColorPicker.addEventListener('input', function() {
            updateAvatarSkinColor(this.value);
        });
    }
    
    // Add event listeners for hair color picker
    const hairColorPicker = document.getElementById('hairColor');
    if (hairColorPicker) {
        // Add input event for real-time updates
        hairColorPicker.addEventListener('input', function() {
            updateAvatarHairColor(this.value);
        });
    }
});
