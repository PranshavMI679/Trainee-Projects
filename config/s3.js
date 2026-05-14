const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3 } = require('../middleware/uploadMiddleware'); 

/**
 * Generates a 24-hour presigned URL for an image stored in S3
 * @param {string} objectKey - The S3 key saved in the DB (e.g., "blogs/img-12345.jpg")
 * @returns {Promise<string|null>} - The active presigned URL or null if failed
 */
const getPresignedUrl = async (objectKey) => {
    if (!objectKey) return null;

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: objectKey,
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 86400 });
        return url;
    } catch (error) {
        console.error(`Failed generating presigned URL for key: ${objectKey}`, error);
        return null;
    }
};

module.exports = { getPresignedUrl };
