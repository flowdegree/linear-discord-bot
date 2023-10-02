import { IncomingLinearWebhookPayload } from './types';

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

/**
 * Get the task ID from url
 * @param link task url
 */
export const getId = (link: string) => {
    return link.split('/')[5];
}

/**
 * Formats and prettifies label(s)
 * @param labels connected labels
 */
export const prettifyLabels = (labels: NonNullable<IncomingLinearWebhookPayload['data']['labels']>) => {
    return labels.map((label) => label.name).join(', ');
}