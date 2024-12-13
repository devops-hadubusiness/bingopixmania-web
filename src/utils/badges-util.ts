// entities
import { session_status } from "@/entities/session/session";
import { campaign_status } from "@/entities/campaign/campaign";
import { campaign_result_status } from "@/entities/campaign_results/campaign_results";
import { campaign_content_result_status } from "@/entities/campaign_content_result/campaign_content_result";
import { contact_status } from "@/entities/contact/contact";

export function getSessionStatusBadgeStyle(status: session_status): string {
  let badgeStyle = "text-white text-xs ";

  try {
    switch (status) {
      case session_status.ACTIVE:
        badgeStyle += "bg-primary hover:bg-primary";
        break;
      case session_status.PENDING:
        badgeStyle += "bg-gray-500 hover:bg-gray-500";
        break;
      case session_status.BLOCKED:
        badgeStyle += "bg-red-700 hover:bg-red-700";
        break;
      case session_status.BUSY:
        badgeStyle += "bg-yellow-700 hover:bg-yellow-700";
        break;
      case session_status.PAUSED:
        badgeStyle += "bg-blue-700 hover:bg-blue-700";
        break;
      case session_status.DELETED:
        badgeStyle += "bg-gray-900 hover:bg-gray-900";
        break;
      case session_status.INACTIVE:
        badgeStyle += "bg-gray-850 hover:bg-gray-850";
        break;
    }
  } catch (err) {
    console.error(`Unhandled error at utils/badges-util.getSessionStatusBadgeStyle function. Details: ${err}`);
  } finally {
    return badgeStyle;
  }
}

export function getCampaignStatusBadgeStyle(status: campaign_status): string {
  let badgeStyle = "text-white text-xs ";

  try {
    switch (status) {
      case campaign_status.RUNNING:
        badgeStyle += "bg-yellow-500 dark:bg-yellow-700/30 hover:bg-yellow-500 dark:hover:bg-yellow-700/30";
        break;

      case campaign_status.DONE:
        badgeStyle += "bg-primary dark:bg-primary/30 hover:bg-primary dark:hover:bg-primary/30";
        break;

      case campaign_status.PAUSED:
        badgeStyle += "bg-blue-500 dark:bg-blue-700/30 hover:bg-blue-500 dark:hover:bg-blue-700/30";
        break;

      case campaign_status.WAITING:
        badgeStyle += "bg-gray-500 dark:bg-gray-500/30 hover:bg-gray-500 dark:hover:bg-gray-500/30";
        break;

      case campaign_status.CANCELED:
        badgeStyle += "bg-red-500 dark:bg-red-700/30 hover:bg-red-500 dark:hover:bg-red-700/30";
        break;

      case campaign_status.DELETED:
        badgeStyle += "bg-gray-900 dark:bg-gray-900/30 hover:bg-gray-900 dark:hover:bg-gray-900/30";
        break;

      default:
        return "transparent";
    }
  } catch (err) {
    console.error(`Unhandled error at utils/badges-util.getCampaignStatusBadgeStyle function. Details: ${err}`);
  } finally {
    return badgeStyle;
  }
}

export function getCampaignResultStatusBadgeStyle(status: campaign_result_status): string {
  let badgeStyle = "text-white text-xs ";

  try {
    switch (status) {
      case campaign_result_status.PENDING:
        badgeStyle += "bg-yellow-500 dark:bg-yellow-700/30 hover:bg-yellow-500 dark:hover:bg-yellow-700/30";
        break;

      case campaign_result_status.DONE:
        badgeStyle += "bg-primary dark:bg-primary/30 hover:bg-primary dark:hover:bg-primary/30";
        break;

      case campaign_result_status.SENDING:
        badgeStyle += "bg-blue-500 dark:bg-blue-700/30 hover:bg-blue-500 dark:hover:bg-blue-700/30";
        break;

      default:
        return "transparent";
    }
  } catch (err) {
    console.error(`Unhandled error at utils/badges-util.getCampaignResultStatusBadgeStyle function. Details: ${err}`);
  } finally {
    return badgeStyle;
  }
}

export function getCampaignContentResultStatusBadgeStyle(status: campaign_content_result_status): string {
  let badgeStyle = "text-white text-xs ";

  try {
    switch (status) {
      case campaign_content_result_status.PENDING:
        badgeStyle += "bg-yellow-500 dark:bg-yellow-700 hover:bg-yellow-500 dark:hover:bg-yellow-700";
        break;

      case campaign_content_result_status.SENT:
        badgeStyle += "bg-primary dark:bg-primary hover:bg-primary dark:hover:bg-primary";
        break;

      case campaign_content_result_status.FAILED:
        badgeStyle += "bg-red-500 dark:bg-red-700 hover:bg-red-500 dark:hover:bg-red-700";
        break;

      default:
        return "transparent";
    }
  } catch (err) {
    console.error(`Unhandled error at utils/badges-util.getCampaignContentResultStatusBadgeStyle function. Details: ${err}`);
  } finally {
    return badgeStyle;
  }
}

export function getContactStatusBadgeStyle(status: contact_status): string {
  let badgeStyle = "text-white text-xs ";

  try {
    switch (status) {
      case contact_status.PENDING:
        badgeStyle += "bg-yellow-500 dark:bg-yellow-700/30 hover:bg-yellow-500 dark:hover:bg-yellow-700/30";
        break;

      case contact_status.DELETED:
        badgeStyle += "bg-gray-500 dark:bg-gray-700/30 hover:bg-gray-500 dark:hover:bg-gray-700/30";
        break;

      case contact_status.HAS_WHATSAPP:
        badgeStyle += "bg-primary dark:bg-primary/30 hover:bg-primary dark:hover:bg-primary/30";
        break;

      case contact_status.NO_MEMBER:
        badgeStyle += "bg-red-500 dark:bg-red-700/30 hover:bg-red-500 dark:hover:bg-red-700/30";
        break;

      default:
        return "transparent";
    }
  } catch (err) {
    console.error(`Unhandled error at utils/badges-util.getContactStatusBadgeStyle function. Details: ${err}`);
  } finally {
    return badgeStyle;
  }
}
