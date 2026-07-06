import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadController = {

    upload: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No image file provided' });
                return;
            }

            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'ruangkopi/gallery',
                        resource_type: 'image',
                        transformation: [
                            { width: 1200, height: 1200, crop: 'limit' },
                            { quality: 'auto' },
                            { fetch_format: 'auto' },
                        ],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                uploadStream.end(req.file!.buffer);
            });

            res.json({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
            });
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const publicId = req.params.publicId;

            if (!publicId) {
                res.status(400).json({ error: 'Public ID is required' });
                return;
            }

            const result = await cloudinary.uploader.destroy(publicId as string);

            if (result.result === 'ok') {
                res.json({ message: 'Image deleted successfully' });
            } else {
                res.status(404).json({ error: 'Image not found or already deleted' });
            }
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            next(error);
        }
    },
};
