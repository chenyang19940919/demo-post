import { useState, useEffect } from "react";
import { storage } from "@/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

export interface FileType {
  name: string;
  url: string;
}

export default function useFirebaseStorage(url?: string) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileType[]>([]);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const initStatus = () => {
      setError(null);
      setSuccess(false);
    };
    initStatus();
  }, [error, success]);

  const uploadTask = (file: any) => {
    const filePath = url
      ?.split("/")
      .filter(Boolean)
      .concat(file.name)
      .join("/");
    const storageRef = ref(storage, filePath);

    const task = uploadBytesResumable(storageRef, file);
    setUploading(true);
    return new Promise<string>((resolve, reject) => {
      task.on(
        "state_changed",
        null,
        (error) => {
          setSuccess(false);
          setError(error);
          setUploading(false);
          reject();
        },
        async () => {
          const downloadURL = await getDownloadURL(task.snapshot.ref);
          if (downloadURL) {
            setSuccess(true);
          }
          setUploading(false);
          resolve(downloadURL);
        }
      );
    });
  };

  const deleteFile = (targetUrl: string) => {
    // Create a reference to the file to delete
    const desertRef = ref(storage, targetUrl);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        setSuccess(true);
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        setError(error);
        setSuccess(false);
      });
  };

  function getListAll() {
    const listRef = ref(storage, url);

    // Find all the prefixes and items.
    return listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          getDownloadURL(itemRef).then((downloadURL) =>
            setFileList((prev) => [
              ...prev,
              { name: itemRef.name, url: downloadURL },
            ])
          );
        });
        console.log(fileList);
      })
      .catch((error) => {
        console.error(error);
        // Uh-oh, an error occurred!
      });
  }

  return {
    success,
    error,
    fileList,
    uploading,
    uploadTask,
    deleteFile,
    getListAll,
  };
}
