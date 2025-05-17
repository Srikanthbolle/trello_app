import { ID, storage } from "../appwrite";

const uploadImage=async(file:File)=>{
    if (!file) return;
    const fileUploaded= await storage.createFile(
        "68134ee100149a255898",
        ID.unique(),
        file
    );
    return fileUploaded;
}

export default uploadImage;