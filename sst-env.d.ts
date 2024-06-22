/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    GuestbookEntries: {
      name: string
      type: "sst.aws.Dynamo"
    }
    GuestbookNextJS: {
      type: "sst.aws.Nextjs"
      url: string
    }
    IPInfoToken: {
      type: "sst.sst.Secret"
      value: string
    }
    ParentZoneId: {
      type: "sst.sst.Secret"
      value: string
    }
  }
}
export {}