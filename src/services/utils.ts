import axios from "axios";
import { IncomingLinearWebhookPayload } from '../types';
import { env } from "../config";

export function POST(body: Record<string, any>, url: string = env.DISCORD_WEBHOOK_URL!) {
  return axios.post(url, body)
}

/**
 * Get the task ID from url
 * @param link task url
 */
export function getId(link: string) {
  return link.split('/')[5];
}

/**
 * Formats and prettifies label(s)
 * @param labels connected labels
 */
export function prettifyLabels(labels: NonNullable<IncomingLinearWebhookPayload['data']['labels']>) {
  if (!labels) {
    return ''
  }

  return labels.map((label) => label.name).join(', ');
}

/**
 * Get the Priority Value translated
 * @param priority number for priority
 */
export const getPriorityValue = (priority: NonNullable<IncomingLinearWebhookPayload['data']['priority']>) => {
    switch (priority) {
        case 0:
            return 'None';
        case 1:
            return 'Urgent';
        case 2:
            return 'High';
        case 3:
            return 'Medium';
        case 4:
            return 'Low';
    }
}