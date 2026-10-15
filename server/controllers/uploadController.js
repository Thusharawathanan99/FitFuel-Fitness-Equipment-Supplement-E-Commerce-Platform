export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    // If Cloudinary returned a secure_url or path
    const imageUrl = req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      imageUrl,
      filename: req.file.filename || req.file.originalname,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
