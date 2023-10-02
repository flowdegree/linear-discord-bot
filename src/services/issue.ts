import { IncomingLinearWebhookPayload, IssueCache } from "src/types"
import { POST, getId, getPriorityValue } from "src/services/utils"

export namespace Issue {

    const issueCache: IssueCache = {}
  
    function describeIssue(payload: IncomingLinearWebhookPayload, authorName: string) {
      return ({
        color: 0x4752b2,
        author: {
          name: authorName
        },
        title: `[${getId(payload.url)}] ${payload.data.title}`,
        url: payload.url,
        fields: generateFields(payload),
        timestamp: new Date(),
        footer: {
          text: `Linear App`,
          icon_url: 'https://pbs.twimg.com/profile_images/1631708750925946880/VOo1Q4T7_400x400.jpg',
        },
      })
    }
  
    function generateFields(payload: IncomingLinearWebhookPayload) {
      return [
        {
          name: 'Priority',
          value: getPriorityValue(payload.data.priority ?? 0),
          inline: true,
        },
        {
          name: 'Estimate',
          value: payload.data.estimate ?? 'None',
          inline: true,
        },
        {
          name: 'Status',
          value: payload.data.state?.name,
          inline: false,
        },
      ]
    }
  
    // monitors if issue was created or if there was a status change 
    function isIssueAlreadyCached(payload: IncomingLinearWebhookPayload) {
      // worth writing tests for some of these util functions but defer since it's not user facing
      const url = payload.url
      const status = payload.data.state?.name as string
  
      if (url in issueCache) {
        if (status === issueCache[url]) {
          return true
        }
      }
  
      issueCache[url] = status
      return false
    }
  
    export function newIssue(payload: IncomingLinearWebhookPayload) {
  
      if (isIssueAlreadyCached(payload)) {
        return
      }
  
      const res = POST(
        {
          embeds: [
            describeIssue(payload, 'Created Issue')
          ],
        }
      )
      return res
    }
  
    export function modifyIssue(payload: IncomingLinearWebhookPayload) {
  
      if (isIssueAlreadyCached(payload)) {
        return
      }
  
      const res = POST(
        {
          embeds: [
            describeIssue(payload, 'Modified Issue')
          ],
        }
      )
      return res
    }
  }