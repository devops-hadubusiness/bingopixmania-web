// packages
import { useState, useEffect, useCallback, useRef } from "react";
import { Check, LoaderCircle, Download } from "lucide-react";
import bwipjs from "bwip-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import html2canvas from 'html2canvas';

// components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/dialogs/custom-dialog";

// hooks
import { useToast } from "@/hooks/use-toast";

// utils
import { getWSClient } from "@/utils/sockets-util";

// entities
import { createSessionSchema, CreateSessionSchema } from "@/entities/session/session";

// store
import { useStore } from "@/store/store";

// types
import { WSSessionQrCodeResponseProps, WSSessionClientResponseProps } from "@/types/ws-types";
type CreateSessionDialogProps = {
  open: boolean;
  sessionRef?: string;
  cb: () => void;
};

// variables
const loc = "components/dialogs/create-session-dialog";

export function CreateSessionDialog({ open, sessionRef, cb }: CreateSessionDialogProps) {
  const { toast } = useToast();
  const store = useStore();
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qr, setQr] = useState<string | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(open);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false);

  const form = useForm<CreateSessionSchema>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      companyId: store.company?.id,
      userId: store.user?.id,
      ref: sessionRef,
      qrCodeTimeout: 60,
      name: "",
    },
  });

  const _createSession = useCallback(async () => {
    try {
      setIsLoading(true);

      const WSClient = await getWSClient();

      if (!WSClient) {
        toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível conectar ao servidor." });
        return;
      }

      setIsQRCodeOpen(true);

      WSClient.send(
        JSON.stringify({
          action: "sendMessage",
          body: {
            action: "createSession",
            ...form.getValues(),
            authorization: store.token,
          },
        })
      );

      WSClient.onmessage = async (event) => {
        const parsedMsg = JSON.parse(event.data || "{}");

        switch (parsedMsg.action) {
          case "qr":
            _parseQrCodeMessage(parsedMsg);
            break;

          case "client":
            _parseClientMessage(parsedMsg);
            break;
        }

        setIsLoading(false);
      };
    } catch (err) {
      console.error(`Unhandled error at ${loc}._createSession. Details: ${err}`);
      toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível criar a sessão." });
    } finally {
      form.reset();
    }
  }, [form]);

  function _parseQrCodeMessage(parsedMsg: WSSessionQrCodeResponseProps) {
    try {
      if (parsedMsg.error) {
        toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível gerar o QR Code." });
        return;
      }

      if (parsedMsg.qrcode) {
        try {
          // The return value is the canvas element
          let canvas = bwipjs.toCanvas("qrTarget", {
            bcid: "qrcode", // Barcode type
            text: parsedMsg.qrcode, // Text to encode
            scale: 1, // 3x scaling factor
            height: 300, // Bar height, in millimeters
            width: 300,
            includetext: false, // Show human-readable text
            textxalign: "center", // Always good to set this
          });

          setQr(parsedMsg.qrcode);
        } catch (e) {
          console.error(e);
          setQr(undefined);
        }
      }
    } catch (err) {
      console.error(`Unhandled error at ${loc}._parseQrCodeMessage function. Details: ${err}`);
      toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível gerar o QR Code." });
    }
  }

  async function _parseClientMessage(parsedMsg: WSSessionClientResponseProps) {
    try {
      setIsAuthenticated(parsedMsg.authenticated);

      if (parsedMsg.authenticated) {
        toast({ variant: "success", title: "Sucesso", description: "Sessão autenticada com sucesso." });
        cb();
      } else toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível autenticar a sessão." });

      setIsOpen(false);
      setIsQRCodeOpen(false);
    } catch (err) {
      console.error(`Unhandled error at ${loc}._parseClientMessage function. Details: ${err}`);
      toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível autenticar a sessão." });
    }
  }

  async function handleDownload() {
    const container = canvasRef.current;
    if (!container) {
      toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível fazer o download." });
      return;
    }

    const canvas = await html2canvas(container);
    const imageUrl = canvas.toDataURL("image/jpeg");
    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = "qrcode.jpeg";
    downloadLink.click();
  }

  useEffect(() => {
    if (sessionRef && !isQRCodeOpen && !qr && !isAuthenticated) _createSession();
  }, [sessionRef, isQRCodeOpen, qr, isAuthenticated, _createSession]);

  return (
    <CustomDialog
      open={isOpen}
      title={sessionRef ? "Reconectar Sessão" : "Adicionar Sessão"}
      onClose={() => {
        setIsOpen(false);
        cb();
      }}
    >
      {!isQRCodeOpen && !sessionRef ? (
        <Form {...form}>
          <form className={`w-full disabled:cursor-not-allowed flex smAndDown:flex-wrap items-start gap-x-2 gap-y-4`} onSubmit={form.handleSubmit(_createSession)}>
            <FormField
              control={form.control}
              name="qrCodeTimeout"
              render={({ field }) => (
                <FormItem className="flex-grow min-w-40 flex-col gap-y-1">
                  <FormLabel>Qr Code (seg): *</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="w-full text-center" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-grow flex-col gap-y-1">
                  <FormLabel>Nome: *</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex-grow items-center w-auto smAndDown:w-full pt-8">
              <Button variant="default" type="submit" className="flex gap-x-2 w-full">
                Criar
                <Check className="size-5" />
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="w-full flex flex-col gap-y-4">
          <div ref={canvasRef} className={`w-full flex flex-col justify-center items-center ${isLoading ? "bg-[#0000000]" : "bg-zinc-100"}`}>
            {isLoading && <LoaderCircle className="absolute m-auto size-10 animate-spin text-primary" />}

            <div className="size-[416px] py-2">
              <canvas id="qrTarget" className={`size-[400px] `} />
            </div>
          </div>

          {!isLoading && (
            <Button variant="default" type="button" className="flex gap-x-2 w-full" onClick={handleDownload}>
              Download
              <Download className="size-5" />
            </Button>
          )}
        </div>
      )}
    </CustomDialog>
  );
}
