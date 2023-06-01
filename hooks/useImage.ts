import { useState, useRef } from "react";

const useImage = () => {
  const [imageName, setImageName] = useState("");
  const [image, setImage] = useState<string | ArrayBuffer | null | undefined>(
    ""
  );
  const imageRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    if (files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (readerEvent) => {
        setImage(readerEvent.target?.result);
      };
      setImageName(files[0].name);
    }
  };

  const onRemove = () => {
    setImageName("");
    setImage("");
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  return {
    imageName,
    image,
    setImage,
    onChange,
    onRemove,
    imageRef,
  };
};

export default useImage;
