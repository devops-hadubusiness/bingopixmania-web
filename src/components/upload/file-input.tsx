import { useCallback, useState } from "react";
import { DropzoneState, useDropzone } from "react-dropzone";
import { CloseIcon } from "@/components/icons/close-icon";
import { UploadIcon } from "@/components/icons/upload-icon";
// import Image from 'next/image'
import { RiFilePdfFill } from "react-icons/ri";
import { TbCsv } from "react-icons/tb";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

interface InputProps {
  dropzone: DropzoneState;
  acceptedFileTypes: string;
  files: File[];
  removeFile: (index: number) => void;
  className?: string;
}

interface HasFileProps {
  files: File[];
  removeFile: (index: number) => void;
}

interface FileInputProps {
  acceptedFiles: string[];
  onFileUpload: (file: File, base64: string, extension: string) => void;
  className?: string;
  multiple?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({ acceptedFiles, onFileUpload, className, multiple = false }) => {
  const [files, setFiles] = useState<File[]>([]);

  const removeFile = useCallback((index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      const newFiles = multiple ? [...files, ...droppedFiles] : droppedFiles;
      setFiles(newFiles);

      droppedFiles.forEach((uploadedFile) => {
        const ext = uploadedFile.name.split(".").pop() || "";

        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          onFileUpload(uploadedFile, base64String, ext);
        };
        reader.readAsDataURL(uploadedFile);
      });
    },
    [files, onFileUpload, multiple]
  );

  const acceptedFilesMap = acceptedFiles.reduce(
    (acc, ext) => {
      let mimeType;
      switch (ext) {
        case ".jpg":
        case ".jpeg":
          mimeType = "image/jpeg";
          break;
        case ".png":
          mimeType = "image/png";
          break;
        case ".pdf":
          mimeType = "application/pdf";
          break;
        case ".docx":
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        case ".csv":
          mimeType = "text/csv";
          break;
        case ".xlsx":
        case ".xls":
          mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          break;
        default:
          mimeType = `application/${ext}`;
      }
      if (!acc[mimeType]) {
        acc[mimeType] = [];
      }
      acc[mimeType].push(ext);
      return acc;
    },
    {} as { [key: string]: string[] }
  );

  const dropzone = useDropzone({
    onDrop,
    accept: acceptedFilesMap,
    multiple,
  });

  const acceptedFileTypes = acceptedFiles.join(", ");

  return (
    <div className="relative w-full max-h-[150px]">
      <Input dropzone={dropzone} acceptedFileTypes={acceptedFileTypes} files={files} removeFile={removeFile} className={className} />
      {files.length > 0 && (
        <button type="button" onClick={clearFiles} className="absolute top-2 right-2">
          <CloseIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

const Input = ({ dropzone, acceptedFileTypes, files, removeFile, className }: InputProps) => {
  const { getRootProps, getInputProps, isDragActive } = dropzone;

  return (
    <div
      {...getRootProps()}
      className={`w-full rounded-lg bg-background dark:bg-gray-700 border border-dashed border-border dark:border-gray-600/25 hover:cursor-pointer hover:bg-gray-100 hover:border-gray-300 dark:hover:bg-gray-500 dark:hover:border-gray-700 transition-all ${isDragActive && "bg-primary/15 border-primary/50 dark:bg-primary/15 dark:border-primary/50"} ${className ?? ""}`}
    >
      <input {...getInputProps()} className="hidden" />

      <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
        {files.length === 0 && !isDragActive && <UploadIcon className={`size-10 mb-3 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />}

        {isDragActive ? (
          <div className="w-full flex flex-col justify-center items-center gap-y-2">
            <UploadIcon className="size-10 mb-1 text-primary" />
            <p className="text-md text-primary mb-0">
              <span className="font-semibold">Solte</span> para adicionar
            </p>
            <p className="text-primary text-sm">{acceptedFileTypes}</p>
          </div>
        ) : (
          <>
            {files.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center gap-y-2">
                <p className="text-md text-muted-foreground text-center">
                  <span className="font-semibold">Clique para enviar</span> ou arraste até aqui
                </p>
                <p className="text-muted-foreground text-sm text-center">{acceptedFileTypes}</p>
              </div>
            ) : (
              <HasFile files={files} removeFile={removeFile} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const HasFile = ({ files, removeFile }: HasFileProps) => {
  return (
    <div className="w-full flex max-h-36 flex-wrap gap-2 justify-center">
      {files.map((file, index) => (
        <div key={index} className="bg-transparent max-h-36 rounded-md flex flex-col items-center justify-center gap-y-2 p-2">
          {file.type.startsWith("image/") ? <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-auto max-h-20 object-contain" width={60} height={60} /> : getIconForFileType(file.type)}
          <span className="text-sm text-muted-foreground">{file.name}</span>
        </div>
      ))}
    </div>
  );
};

const getIconForFileType = (fileType: string) => {
  switch (fileType) {
    case "application/pdf":
      return <img src="/icons/pdf_icon.svg" width={40} height={40} alt="Logo arquivo pdf" />;
    case "text/csv":
      return <img src="/icons/csv_icon.svg" width={40} height={40} alt="Logo arquivo csv" />;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return <img src="/icons/excel_icon.svg" width={40} height={40} alt="Logo arquivo excel" />;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <img src="/icons/docx_icon.svg" width={40} height={40} alt="Logo arquivo docx" />;
    default:
      return <UploadIcon className="size-10 text-muted-foreground" />;
  }
};
