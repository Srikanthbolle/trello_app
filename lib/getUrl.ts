// Define your own type for the image object
type UploadedImage = {
    bucketId: string;
    fileId: string;
  };
  
  import { storage } from "../appwrite";
  
  const getUrl = async (image: UploadedImage | string): Promise<string> => {
    if (typeof image === 'string') {
        return Promise.resolve(image); // or handle accordingly
      }
    const url = storage.getFilePreview(image.bucketId, image.fileId);
    return url;
  };
  
  export default getUrl;
  