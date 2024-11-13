// cloud_storage.ts
import { Bucket, Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const projectId: string = 'ecommerce-api-app-c6';
const keyFilename: string = './serviceAccountKey.json';
const bucketName: string = 'gs://ecommerce-api-app-c6.appspot.com';

const storage: Storage = new Storage({ projectId, keyFilename });
const bucket: Bucket = storage.bucket(bucketName);

const uploadFile = async (file: any, pathImage?: string): Promise<string> => {
    if (!pathImage) {
        throw new Error('Se requiere la ruta de la imagen');
    }

    try {
        const fileRef = bucket.file(pathImage);
        const uuid = uuidv4();

        await new Promise<void>((resolve, reject) => {
            const uploadStream = fileRef.createWriteStream({
                metadata: {
                    contentType: 'image/png',
                    metadata: {
                        firebaseStorageDownloadTokens: uuid,
                    },
                },
                resumable: false,
            });

            uploadStream.on('error', (error) => {
                console.error('Error al subir el archivo a Firebase:', error);
                reject(error);
            });

            uploadStream.on('finish', () => {
                resolve();
            });

            uploadStream.end(file.buffer);
        });

        const url: string = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileRef.name}?alt=media&token=${uuid}`;
        console.log('URL de Cloud Storage:', url);
        return url;
    } catch (error) {
        console.error('Error al subir el archivo a Firebase:', error);
        throw new Error(
            'Algo salió mal. No se pudo subir el archivo en este momento.',
        );
    }
};

export default uploadFile;
