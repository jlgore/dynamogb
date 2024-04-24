/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "dynamogb",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const parentZoneId = new sst.Secret("ParentZoneId");

    const dns = sst.aws.dns({zone: parentZoneId.value});
    
    const secret = new sst.Secret("IPInfoToken");

    const table = new sst.aws.Dynamo("GuestbookEntries", {
      fields: {
        userName: "string",
        noteId: "string",
        message: "string",
        timestamp: "string",
        ip: "string",
        country: "string",
        city: "string"
      },
      primaryIndex: { hashKey: "userName", rangeKey: "noteId" },
      localIndexes: {
        byTimestamp: { rangeKey: "timestamp" },
        byCountry: { rangeKey: "country" },
        byMessage: { rangeKey: "message" },
        byCity: { rangeKey: "city" },
        byIp: { rangeKey: "ip" }
      }
    });


    new sst.aws.Nextjs("GuestbookNextJS", {
      openNextVersion: "3.0.0-rc.15",
      link: [table, secret],
     // domain: "ddbgb.onlyfaas.com",
      transform: {
        cdn: (args) => {
          return {
            ...args,
            distribution: {
              defaultBehavior: {
                viewerProtocolPolicy: "redirect-to-https",
                forwardedValues: {
                  headers: ["X-Forwarded-For"],
                },
              },
            },
          };
        },
      }, 
      environment: {
        IPINFO_TOKEN: process.env.IPINFO_TOKEN || "123",
      }
    });
  },
});
