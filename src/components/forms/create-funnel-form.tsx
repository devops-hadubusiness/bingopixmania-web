// packages
import { useState, useRef, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Archive, FileText, Image, Music, Video, Save, Check } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

// components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/upload/file-input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// entities
import { CreateCampaignSchema, createCampaignSchema, campaign_category, formatted_campaign_category } from "@/entities/campaign/campaign";
import { campaign_content_extension, campaign_content_type, CampaignContentsProps, CreateCampaignContentsSchema, createCampaignContentsSchema } from "@/entities/campaign_contents/campaign_contents";

// store
import { useStore } from "@/store/store";
import { Input } from "../ui/input";

// types
type CreateFunnelFormProps = {
  onSubmitted(data: { category: campaign_category; contents: CreateCampaignContentsSchema[] }): void;
};
type FileProps = {
  file: File;
  base64: string;
  extension: string;
};

function getIconByContentType(type: campaign_content_type) {
  switch (type) {
    case campaign_content_type.TEXT:
      return <FileText className="size-10 dark:text-accent" />;
    case campaign_content_type.IMAGE:
      return <Image className="size-10" />;
    case campaign_content_type.IMAGE_TEXT:
      return (
        <div className="flex gap-x-2">
          <Image className="size-10" />
          <FileText className="size-10" />
        </div>
      );
    case campaign_content_type.VIDEO:
      return <Video className="size-10" />;
    case campaign_content_type.VIDEO_TEXT:
      return (
        <div className="flex gap-x-2">
          <Video className="size-10" />
          <FileText className="size-10" />
        </div>
      );
    case campaign_content_type.AUDIO:
      return <Music className="size-10" />;
    case campaign_content_type.AUDIO_TEXT:
      return (
        <div className="flex gap-x-2">
          <Music className="size-10" />
          <FileText className="size-10" />
        </div>
      );
    case campaign_content_type.DOCUMENT:
      return <Archive className="size-10" />;
    case campaign_content_type.DOCUMENT_TEXT:
      return (
        <div className="flex gap-x-2">
          <Archive className="size-10" />
          <FileText className="size-10" />
        </div>
      );
    default:
      return <FileText className="size-10" />;
  }
}

export function CreateFunnelForm({ onSubmitted }: CreateFunnelFormProps) {
  const store = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [content, setContent] = useState<CreateCampaignContentsSchema>({});
  const [contents, setContents] = useState<CreateCampaignContentsSchema[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [file, setFile] = useState<FileProps>({});
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [useRandomHash, setUseRandomHash] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Formulário para Campaign
  const formCampaign = useForm<CreateCampaignSchema>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      category: campaign_category.INDIVIDUAL,
    },
  });

  // Formulário para CampaignContents
  const formContents = useForm<CreateCampaignContentsSchema>({
    resolver: zodResolver(createCampaignContentsSchema),
    defaultValues: {
      delay: [30, 300],
      useRandomHash: false,
    },
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setEmojiPickerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function _handleFileUpload(file: File, base64: string, extension: string) {
    setFile({
      file,
      base64,
      extension,
    });
    formContents.setValue("extension", extension as campaign_content_extension);
    formContents.setValue("file", { name: file.name, base64, extension });
  }

  async function _addContent() {
    let content = formContents.getValues();

    let determinedType = "";
    if (file.file) {
      switch (file.extension) {
        case "jpg":
        case "jpeg":
        case "png":
        case "svg":
          determinedType = campaign_content_type.IMAGE;
          break;
        case "pdf":
        case "doc":
        case "xls":
        case "csv":
        case "xlsx":
          determinedType = campaign_content_type.DOCUMENT;
          break;
        case "mp3":
        case "ogg":
          determinedType = campaign_content_type.AUDIO;
          break;
        case "mp4":
          determinedType = campaign_content_type.VIDEO;
          break;
        default:
          determinedType = campaign_content_type.DOCUMENT;
          break;
      }

      if (content.content) {
        if (determinedType === campaign_content_type.IMAGE) {
          determinedType = campaign_content_type.IMAGE_TEXT;
        } else if (determinedType === campaign_content_type.VIDEO) {
          determinedType = campaign_content_type.VIDEO_TEXT;
        } else if (determinedType === campaign_content_type.DOCUMENT) {
          determinedType = campaign_content_type.DOCUMENT_TEXT;
        } else if (determinedType === campaign_content_type.AUDIO) {
          determinedType = campaign_content_type.AUDIO_TEXT;
        }
      }

      formContents.setValue("type", determinedType);
    } else if (content.content) {
      formContents.setValue("type", campaign_content_type.TEXT);
      formContents.setValue("extension", campaign_content_extension.text);
    }

    // Definir o index baseado no comprimento atual do array (sempre começando em 1)
    formContents.setValue("index", contents.length + 1);

    content = formContents.getValues();

    const isValid = await formContents.trigger();

    if (!isValid) {
      console.log("Validação falhou", formContents.formState.errors);
      return;
    }

    setContents([...contents, content]);

    formContents.reset({
      delay: [30, 300],
      content: "",
      file: undefined,
      extension: undefined,
      type: undefined,
      useRandomHash,
    });
    setFileInputKey((prevKey) => prevKey + 1);
    setFile({} as FileProps);
    setContent({} as CreateCampaignContentsSchema);
  }

  function onDragStart(index: number) {
    setDraggingIndex(index);
  }

  function onDragOver(index: number) {
    if (draggingIndex === null || draggingIndex === index) return;

    const draggedOverItem = contents[draggingIndex];
    const newContents = [...contents];

    newContents.splice(draggingIndex, 1);

    newContents.splice(index, 0, draggedOverItem);

    const updatedContents = newContents.map((item, idx) => ({
      ...item,
      index: idx + 1,
    }));

    setDraggingIndex(index);
    setContents(updatedContents);
  }

  function onDragEnd() {
    setDraggingIndex(null);
  }

  function removeContent(index: number) {
    const newContents = contents.filter((_, i) => i !== index);

    const updatedContents = newContents.map((item, idx) => ({
      ...item,
      index: idx + 1,
    }));

    setContents(updatedContents);
  }

  function handleSave() {
    const category = formCampaign.getValues("category");
    onSubmitted({ category, contents });
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    // Use o valor atual do textarea diretamente
    const currentContent = formContents.getValues("content") || "";

    // Adicione o emoji ao conteúdo atual
    const newContent = `${currentContent}${emojiData.emoji}`;

    setContent((prev) => ({
      ...prev,
      content: newContent,
    }));
    formContents.setValue("content", newContent);
  };

  const handleTextareaChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = evt.target.value;
    setContent({ ...content, content: newValue });
    formContents.setValue("content", newValue);
  };

  const handleInsertPlaceholder = (placeholder: string) => {
    const currentContent = formContents.getValues("content") || "";
    const newContent = `${currentContent} ${placeholder}`;

    setContent((prev) => ({
      ...prev,
      content: newContent,
    }));
    formContents.setValue("content", newContent);
  };

  const _toggleUseRandomHash = (): void => {
    formContents.setValue("useRandomHash", !useRandomHash);
    setUseRandomHash(!useRandomHash);
  };

  return (
    <div className="flex flex-row justify-between align-start gap-x-4">
      <div className="w-[60%] space-y-4">
        <Form {...formCampaign}>
          <form onKeyDown={(evt) => evt.key === "Enter" && evt?.preventDefault()} className="w-full disabled:cursor-not-allowed space-y-4">
            <FormField
              control={formCampaign.control}
              name="category"
              render={({ field }) => (
                <FormItem className="md:w-full">
                  <FormLabel>Categoria</FormLabel>
                  <Select disabled onValueChange={(value) => field.onChange(value)} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(formatted_campaign_category).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <Form {...formContents}>
          <form className="w-full disabled:cursor-not-allowed space-y-8">
            <FileInput key={fileInputKey} acceptedFiles={[".jpg", ".jpeg", ".png", ".svg", ".pdf", ".mp3", ".ogg", ".mp4", ".xls", ".xlsx", ".csv"]} onFileUpload={_handleFileUpload} />

            <FormField
              control={formContents.control}
              name="content"
              render={({ field }) => (
                <FormItem className="md:w-full">
                  <FormLabel>Texto</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none min-h-40" style={{zIndex: '100 !important'}} value={field.value} onChange={handleTextareaChange} />
                  </FormControl>

                  <div className="w-full relative">
                    <div className="flex gap-x-2 absolute bottom-0 left-[2px] p-2 bg-background dark:bg-gray-900 w-[calc(100%_-_4px)] rounded-md">
                      <Button variant="default" type="button" className="rounded-md py-[2px] px-2 text-xs" size="xs" onClick={() => handleInsertPlaceholder("#Saudação")} onKeyDown={(evt) => evt.key === "Enter" && evt?.preventDefault()}>
                        #Saudação
                      </Button>

                      <Button variant="default" type="button" className="rounded-md py-[2px] px-2 text-xs" size="xs" onClick={() => handleInsertPlaceholder("#Nome")} onKeyDown={(evt) => evt.key === "Enter" && evt?.preventDefault()}>
                        #Nome
                      </Button>
                    </div>

                    <Button variant="ghost" type="button" className="absolute bottom-2 right-2 border border-border dark:border-gray-500 rounded-lg p-1 text-xs" size="xs" onClick={() => setEmojiPickerVisible(!isEmojiPickerVisible)} onKeyDown={(evt) => evt.key === "Enter" && evt?.preventDefault()}>
                      😀
                    </Button>

                    {isEmojiPickerVisible && (
                      <div ref={ref} className="absolute bottom-12 right-0">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row justify-between items-center gap-x-2">
              <FormField
                control={formContents.control}
                name="delay"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Intervalo</FormLabel>
                    <FormControl>
                      <div className="flex gap-x-2 items-center">
                        <span className="text-sm">De</span>
                        <Input
                          type="number"
                          min={30}
                          max={300}
                          value={field.value?.[0] || 30}
                          onChange={(e) => {
                            const startValue = Number(e.target.value);
                            const endValue = field.value?.[1] || 300;
                            formContents.setValue("delay", [startValue, endValue]);
                          }}
                          className="max-w-20 text-center"
                          onKeyDown={(evt) => evt.key === "Enter" && evt?.preventDefault()}
                        />
                        <span className="text-sm">a</span>
                        <Input
                          type="number"
                          min={30}
                          max={300}
                          value={field.value?.[1] || 300}
                          onChange={(e) => {
                            const startValue = field.value?.[0] || 30;
                            const endValue = Number(e.target.value);
                            formContents.setValue("delay", [startValue, endValue]);
                          }}
                          className="max-w-20 text-center"
                          onKeyDown={(evt) => evt.key === "Enter" && evt?.preventDefault()}
                        />
                        <span className="text-xs text-muted-foreground">segundos</span>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formContents.control}
                name="useRandomHash"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Intervalo</FormLabel> */}
                    <FormControl>
                      <div className="flex items-center gap-x-2 group">
                        <Checkbox checked={useRandomHash} onClick={_toggleUseRandomHash} />
                        <Label className="group-hover:cursor-pointer" onClick={_toggleUseRandomHash}>
                          Utilizar Hash Randômico
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex justify-center">
              {/* TODO: controlar disabled se o form estiver inválido */}
              <Button
                variant="secondary"
                type="submit"
                onClick={(evt) => {
                  evt.preventDefault();
                  _addContent();
                }}
                className="w-full flex gap-x-2 bg-border hover:brightness-75 dark:bg-secondary dark:hover:brightness-125"
              >
                Adicionar
                <Check className="size-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="flex flex-col w-[40%] min-h-full gap-y-4">
        <div className="bg-background dark:bg-gray-900 border h-full max-h-[605px] overflow-y-auto rounded-xl p-4 flex flex-col gap-y-2">
          {contents.map((c, index) => (
            <div
              key={index}
              className={`p-2 bg-accent border dark:border-gray-500 hover:cursor-grab transition-transform duration-500 ease-in-out ${draggingIndex === index ? "opacity-50" : ""} rounded-xl grid grid-cols-12 relative`}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={() => onDragOver(index)}
              onDragEnd={onDragEnd}
            >
              <div className="col-span-11 flex flex-col line-clamp-6">
                {!!c.content && !c.file ? (
                  <span className="truncate">{c.content}</span>
                ) : (
                  <div className="flex flex-col w-full items-center">
                    <div className="w-full flex justify-center">{getIconByContentType(c.type)}</div>
                    <div className="flex flex-col w-full items-start">
                      <span className="truncate text-nowrap text-sm p-1">Arquivo: {c.file?.name}</span>
                      {c.content && <span className="truncate text-sm pl-1 w-full">Mensagem: {c.content}</span>}
                    </div>
                  </div>
                )}
                <span className="text-xs p-1">
                  Intervalo: de {c.delay[0]}s a {c.delay[1]}s
                </span>
                <div>
                  <span className={`bg-${c.useRandomHash ? "primary" : "gray-850"} text-white text-xs py-1 px-2 text-center w-auto rounded-lg`}>Hash Randômico</span>
                </div>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={() => removeContent(index)} className="bg-transparent rounded-full absolute top-2 right-2">
                    <X className="size-5 text-red-500 hover:scale-125" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-accent text-xs">Remover</TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>

        <Button variant="default" disabled={contents.length <= 0} onClick={handleSave} className="w-full flex gap-x-2">
          Salvar
          <Save className="size-5" />
        </Button>
      </div>
    </div>
  );
}
