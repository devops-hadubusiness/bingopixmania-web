export type TAuth = {
  action: "login";
};

export type TCreateEntity = {
  action: "session" | "campaign" | "contact";
};

export type TGetEntity = {
  action: "session_by_ref" | "sessions_user_by_status" | "campaign_by_ref" | "campaigns_user_by_status" | "contacts_user_by_status";
};

export type TUpdateEntity = {
  action: "session" | "campaign";
};

export type TDeleteEntity = {
  action: "session" | "campaign";
};
