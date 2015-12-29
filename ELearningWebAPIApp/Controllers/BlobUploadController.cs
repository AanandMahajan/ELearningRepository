using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Shared.Protocol;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace ELearning.WebAPI.Controllers
{
    public class BlobUploadController : ApiController
    {        
        [HttpGet]
        public bool RemoveAllCorsRuleStorage(int id)
        {
            var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);
            var client = storageAccount.CreateCloudBlobClient();
            var serviceProperties = client.GetServiceProperties();
            var corsSettings = serviceProperties.Cors;
            int length = corsSettings.CorsRules.Count;
            int count = 0;
            while (count < length )
            {
                corsSettings.CorsRules.RemoveAt(count);
                length--;
            }
            client.SetServiceProperties(serviceProperties);
            return true;
        }

        [HttpGet]
        public bool AddCorsRuleStorage()
        {
            bool flag = false;
            //First get the service properties from storage to ensure we're not adding the same CORS rule again.
            //var storageAccount = new CloudStorageAccount(new StorageCredentials("elearningstrg", "Bu/Jmq/C7thfDoJh5MhC78pii0QLXLTs6ckAffgV8NGYNyMvSP7HUwVHyw5GNmy+tQmRMDFcWO3ZEWRDCA4wig=="), true);
            var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);
            var client = storageAccount.CreateCloudBlobClient();
            var serviceProperties = client.GetServiceProperties();
            var corsSettings = serviceProperties.Cors;

            //Check rule, if exists update the rule.
            var corsRuleToBeUpdated = corsSettings.CorsRules.FirstOrDefault(a => a.AllowedOrigins.Contains("*"));
            if (corsRuleToBeUpdated != null)
            {
                corsRuleToBeUpdated.MaxAgeInSeconds = 1 * 60 * 60;
                //corsRuleToBeUpdated.AllowedMethods = corsRuleToBeUpdated.AllowedMethods | CorsHttpMethods.Get;
                client.SetServiceProperties(serviceProperties);
                flag = true;
            }
            else
            {
                //Add a new rule.
                var corsRule = new CorsRule()
                {
                    AllowedHeaders = new List<string> { "x-ms-*", "content-type", "accept" },
                    AllowedMethods = CorsHttpMethods.Put | CorsHttpMethods.Get,//Since we'll only be calling Put Blob, just allow PUT verb
                    AllowedOrigins = new List<string> { "*" },//This is the URL of our application, * for all origin.
                    MaxAgeInSeconds = 1 * 60 * 60,//Let the browswer cache it for 10 mins
                };
                corsSettings.CorsRules.Add(corsRule);
                client.SetServiceProperties(serviceProperties);
                flag = true;
            }
            return flag;
        }
        

        [HttpGet]
        public string GetSaS(string containerName, string blobName)
        {
            //1. Nuget: Install-Package WindowsAzure.Storage

            //2. Get context account
            var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);

            //3. Create a blob client
            var blobClient = storageAccount.CreateCloudBlobClient();

            //4. Get a container and create it if not exists
            var container = blobClient.GetContainerReference(containerName);
            container.CreateIfNotExists();

            //5. Get a blob reference
            CloudBlockBlob blob = container.GetBlockBlobReference(blobName);

            //6. Create a Shared Access Signature for the blob
            var SaS = blob.GetSharedAccessSignature(
               new SharedAccessBlobPolicy()
               {
                   Permissions = SharedAccessBlobPermissions.Write,
                   SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(60),
               });
            string url = SaS;
            return url;//string.Format(CultureInfo.InvariantCulture, "{0}{1}", blob.Uri, SaS);
        }
    }
}
