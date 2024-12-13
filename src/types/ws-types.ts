export type WSSessionQrCodeResponseProps = {
  action: "qr";
  qrcode?: string;
  error?: boolean;
};

export type WSSessionClientResponseProps = {
  action: "client";
  authenticated: boolean;
  phone?: string;
  profileName?: string;
  profilePicURL?: string;
};

export type WSBaseResponseProps =
  | WSSessionQrCodeResponseProps
  | WSSessionClientResponseProps
  | {
      action: string;
      [key: string | number]: any;
    };
